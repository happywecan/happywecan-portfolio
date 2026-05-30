from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
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
        # Asynchronously write the file to the server's disk
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()  # Read file content
            if len(content) > MAX_UPLOAD_BYTES:
                raise HTTPException(status_code=413, detail="File must be 5MB or smaller")
            await out_file.write(content)  # Write content to file
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"There was an error uploading the file: {e}")

    # Return the relative path that the frontend can use
    relative_path = f"/{file_path.replace(os.path.sep, '/')}"
    return {"file_path": relative_path}
