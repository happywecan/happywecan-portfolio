from io import BytesIO

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from PIL import Image, UnidentifiedImageError
from services.auth_service import get_current_admin_user
import aiofiles
import os
from uuid import uuid4

router = APIRouter()

# Define the directory where files will be saved
UPLOAD_DIR = "static/uploads"
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
UPLOAD_CHUNK_BYTES = 64 * 1024
ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP", "GIF"}

@router.post("/upload", dependencies=[Depends(get_current_admin_user)])
async def upload_image(file: UploadFile = File(...)):
    """
    Handles image uploads from the admin panel.
    - Ensures the user is an authenticated admin.
    - Generates a unique filename to prevent overwrites.
    - Saves the file to the UPLOAD_DIR.
    - Returns the relative path to the saved file.
    """
    # Ensure the upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate a unique filename using UUID and keeping the original extension
    file_extension = os.path.splitext(file.filename or "")[1].lower()
    if file.content_type not in ALLOWED_CONTENT_TYPES or file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, and GIF images are allowed")

    unique_filename = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        chunks = []
        size = 0
        while chunk := await file.read(UPLOAD_CHUNK_BYTES):
            size += len(chunk)
            if size > MAX_UPLOAD_BYTES:
                raise HTTPException(status_code=413, detail="File must be 5MB or smaller")
            chunks.append(chunk)

        content = b"".join(chunks)
        try:
            with Image.open(BytesIO(content)) as image:
                if image.format not in ALLOWED_IMAGE_FORMATS:
                    raise HTTPException(status_code=400, detail="Unsupported image format")
                image.verify()
        except (UnidentifiedImageError, OSError):
            raise HTTPException(status_code=400, detail="Invalid image file")

        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(content)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Image upload failed: {e}")
        raise HTTPException(status_code=500, detail="There was an error uploading the file")

    # Return the relative path that the frontend can use
    relative_path = f"/{file_path.replace(os.path.sep, '/')}"
    return {"file_path": relative_path}
