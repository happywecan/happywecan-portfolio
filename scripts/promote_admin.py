import argparse
import asyncio
import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient


load_dotenv()


async def promote_admin(email: str) -> None:
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable not set.")

    client = AsyncIOMotorClient(mongodb_uri)
    try:
        db = client.get_default_database()
        result = await db.users.update_one(
            {"email": email},
            {"$set": {"role": "admin"}},
        )
        if result.matched_count != 1:
            raise ValueError(f"No user found for email: {email}")
        print(f"Admin role granted to: {email}")
    finally:
        client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Grant the admin role to an existing user.")
    parser.add_argument("--email", required=True, help="Existing user email address")
    args = parser.parse_args()
    asyncio.run(promote_admin(args.email))
