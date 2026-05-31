import asyncio
import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from typing import Any, Optional

import pytz
from bson.objectid import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

from services.auth_service import get_current_admin_user
from services.db_service import get_database

router = APIRouter()


class ContactFormRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120, description="Sender name")
    email: EmailStr = Field(..., description="Sender email address")
    message: str = Field(..., min_length=1, max_length=5000, description="Contact message")


class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr = Field(..., description="Subscriber email")
    source: Optional[str] = Field("about_page", max_length=80)


class ContactStatusUpdateRequest(BaseModel):
    read: Optional[bool] = None
    replied: Optional[bool] = None


class ContactItem(BaseModel):
    id: str
    name: str
    email: EmailStr
    message: str
    created_at: datetime
    read: bool = False
    replied: bool = False


def _to_bool(value: Optional[str], default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _send_contact_notification_sync(sender_name: str, sender_email: str, message: str) -> None:
    mail_server = os.getenv("MAIL_SERVER")
    mail_username = os.getenv("MAIL_USERNAME")
    mail_password = os.getenv("MAIL_PASSWORD")
    mail_port = int(os.getenv("MAIL_PORT", "587"))
    mail_use_tls = _to_bool(os.getenv("MAIL_USE_TLS"), True)
    notify_to = os.getenv("CONTACT_NOTIFY_TO") or mail_username

    if not mail_server or not mail_username or not mail_password or not notify_to:
        return

    email_message = EmailMessage()
    email_message["Subject"] = f"[Portfolio Contact] {sender_name}"
    email_message["From"] = mail_username
    email_message["To"] = notify_to
    email_message["Reply-To"] = sender_email
    email_message.set_content(
        f"New contact submission\n\n"
        f"Name: {sender_name}\n"
        f"Email: {sender_email}\n\n"
        f"Message:\n{message}\n"
    )

    with smtplib.SMTP(mail_server, mail_port, timeout=20) as server:
        if mail_use_tls:
            server.starttls()
        server.login(mail_username, mail_password)
        server.send_message(email_message)


@router.post("/contactme", response_model=dict, status_code=status.HTTP_201_CREATED)
async def contact_form(data: ContactFormRequest, db: AsyncIOMotorClient = Depends(get_database)):
    try:
        contact_data = {
            "name": data.name,
            "email": str(data.email),
            "message": data.message,
            "created_at": datetime.now(pytz.utc),
            "read": False,
            "replied": False,
        }
        await db.contacts.insert_one(contact_data)

        try:
            await asyncio.to_thread(
                _send_contact_notification_sync,
                data.name,
                str(data.email),
                data.message,
            )
        except Exception as mail_error:
            # Do not break form success if SMTP fails.
            print(f"Contact notification email failed: {mail_error}")

        return {
            "success": True,
            "message": "Your message has been sent. I will get back to you soon.",
        }
    except Exception as exc:
        print(f"Contact form save failed: {exc}")
        raise HTTPException(status_code=500, detail="Server error while saving contact form")


@router.post("/subscribe", response_model=dict, status_code=status.HTTP_201_CREATED)
async def subscribe_newsletter(data: NewsletterSubscribeRequest, db: AsyncIOMotorClient = Depends(get_database)):
    try:
        email = str(data.email)
        existing_subscriber = await db.newsletter_subscribers.find_one({"email": email})

        if existing_subscriber:
            if not existing_subscriber.get("active", True):
                await db.newsletter_subscribers.update_one(
                    {"email": email},
                    {"$set": {"active": True, "subscribed_at": datetime.now(pytz.utc)}},
                )
                return {"success": True, "message": "Subscription reactivated."}
            raise HTTPException(status_code=400, detail="This email is already subscribed.")

        subscriber_data = {
            "email": email,
            "subscribed_at": datetime.now(pytz.utc),
            "active": True,
            "source": data.source,
        }
        await db.newsletter_subscribers.insert_one(subscriber_data)
        return {
            "success": True,
            "message": "Subscription successful. Thanks for following.",
        }
    except HTTPException:
        raise
    except Exception as exc:
        print(f"Newsletter subscription failed: {exc}")
        raise HTTPException(status_code=500, detail="Server error while subscribing")


@router.get("/contacts", response_model=list[ContactItem])
async def get_contacts_admin(
    db: AsyncIOMotorClient = Depends(get_database),
    admin_user: dict = Depends(get_current_admin_user),
    limit: int = Query(200, ge=1, le=1000),
):
    try:
        docs = await db.contacts.find().sort("created_at", -1).to_list(limit)
        return [
            ContactItem(
                id=str(doc.get("_id")),
                name=doc.get("name", ""),
                email=doc.get("email", ""),
                message=doc.get("message", ""),
                created_at=doc.get("created_at", datetime.now(pytz.utc)),
                read=bool(doc.get("read", False)),
                replied=bool(doc.get("replied", False)),
            )
            for doc in docs
        ]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch contacts: {exc}")


@router.patch("/contacts/{contact_id}", response_model=ContactItem)
async def update_contact_status_admin(
    contact_id: str,
    payload: ContactStatusUpdateRequest,
    db: AsyncIOMotorClient = Depends(get_database),
    admin_user: dict = Depends(get_current_admin_user),
):
    if not ObjectId.is_valid(contact_id):
        raise HTTPException(status_code=400, detail="Invalid contact ID")

    update_data: dict[str, Any] = {}
    if payload.read is not None:
        update_data["read"] = payload.read
    if payload.replied is not None:
        update_data["replied"] = payload.replied
    if not update_data:
        raise HTTPException(status_code=400, detail="No status fields provided")

    await db.contacts.update_one({"_id": ObjectId(contact_id)}, {"$set": update_data})
    doc = await db.contacts.find_one({"_id": ObjectId(contact_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Contact not found")

    return ContactItem(
        id=str(doc.get("_id")),
        name=doc.get("name", ""),
        email=doc.get("email", ""),
        message=doc.get("message", ""),
        created_at=doc.get("created_at", datetime.now(pytz.utc)),
        read=bool(doc.get("read", False)),
        replied=bool(doc.get("replied", False)),
    )
