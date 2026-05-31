import os

import httpx
from fastapi import APIRouter, Depends, HTTPException, Path, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, HttpUrl
from starlette.background import BackgroundTask

from services.auth_service import get_current_admin_user

router = APIRouter()


class CreateYtdlJobRequest(BaseModel):
    url: HttpUrl
    format: str = Field(..., pattern=r"^[A-Za-z0-9_-]{1,32}$")


def get_ytdl_config() -> tuple[str, str]:
    base_url = os.getenv("TOOLS_API_BASE_URL") or os.getenv("YT_DWLER_BASE_URL")
    api_key = os.getenv("TOOLS_API_KEY") or os.getenv("YT_DWLER_API_KEY")

    if not base_url or not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="tools-api integration is not configured.",
        )

    return base_url.rstrip("/"), api_key


@router.post("/tools/ytdl/downloads", summary="Create yt_dwler download job")
async def create_ytdl_download(
    payload: CreateYtdlJobRequest,
    current_user: dict = Depends(get_current_admin_user),
):
    base_url, api_key = get_ytdl_config()

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{base_url}/api/downloads",
            headers={"X-API-Key": api_key},
            json={
                "url": str(payload.url),
                "format": payload.format,
            },
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=response.status_code,
            detail="Upstream tools service rejected the request.",
        )

    return response.json()


@router.get("/tools/ytdl/downloads/{job_id}", summary="Get yt_dwler job status")
async def get_ytdl_download(
    job_id: str = Path(..., pattern=r"^[A-Za-z0-9_-]{1,128}$"),
    current_user: dict = Depends(get_current_admin_user),
):
    base_url, api_key = get_ytdl_config()

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            f"{base_url}/api/downloads/{job_id}",
            headers={"X-API-Key": api_key},
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=response.status_code,
            detail="Upstream tools service rejected the request.",
        )

    return response.json()


@router.get("/tools/ytdl/downloads/{job_id}/file", summary="Proxy yt_dwler file")
async def get_ytdl_file(
    job_id: str = Path(..., pattern=r"^[A-Za-z0-9_-]{1,128}$"),
    current_user: dict = Depends(get_current_admin_user),
):
    base_url, api_key = get_ytdl_config()

    client = httpx.AsyncClient(timeout=None)
    request = client.build_request(
        "GET",
        f"{base_url}/api/downloads/{job_id}/file",
        headers={"X-API-Key": api_key},
    )
    response = await client.send(request, stream=True)

    if response.status_code >= 400:
        error_body = await response.aread()
        await response.aclose()
        await client.aclose()
        raise HTTPException(
            status_code=response.status_code,
            detail="Upstream tools service rejected the request.",
        )

    async def close_upstream() -> None:
        await response.aclose()
        await client.aclose()

    headers = {}
    content_disposition = response.headers.get("content-disposition")

    if content_disposition:
        headers["content-disposition"] = content_disposition

    return StreamingResponse(
        response.aiter_bytes(),
        media_type=response.headers.get("content-type", "application/octet-stream"),
        headers=headers,
        background=BackgroundTask(close_upstream),
    )
