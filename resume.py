from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from auth import oauth2_scheme  # Import authentication
import psycopg2
from psycopg2.extras import RealDictCursor
import base64
import jwt

resume_router = APIRouter()

# Database Connection
DB_NAME = "skillfit_ai"
DB_USER = "postgres"
DB_PASSWORD = "6969"
DB_HOST = "localhost"
DB_PORT = "5432"

conn = psycopg2.connect(
    dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT, cursor_factory=RealDictCursor
)
cursor = conn.cursor()

# JWT Secret Key
SECRET_KEY = "c587ee0dd8cc5a7c23de162a36f10d4c12d4fd776f488ccf90e4ee38000c4467"

# 🚀 Upload Resume Endpoint
@resume_router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    token: str = Depends(oauth2_scheme)
):
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_email = payload.get("sub")

        # Fetch user ID from database
        cursor.execute("SELECT id FROM users WHERE email = %s", (user_email,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user["id"]

        # Read file content
        file_content = await file.read()
        encoded_file = base64.b64encode(file_content).decode()  # Convert to Base64 for storage

        # Store in PostgreSQL
        cursor.execute("""
            INSERT INTO resume_analyses (user_id, resume_file, file_name, file_type, job_description)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, encoded_file, file.filename, file.content_type, job_description))

        conn.commit()
        return {"message": "Resume uploaded successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# 📥 Retrieve Resume & Analysis
@resume_router.get("/resume-analysis/{user_id}")
async def get_resume_analysis(user_id: int):
    try:
        cursor.execute("SELECT * FROM resume_analyses WHERE user_id = %s", (user_id,))
        resume_data = cursor.fetchall()

        if not resume_data:
            raise HTTPException(status_code=404, detail="No resume data found")

        # Convert binary file data to Base64 for API response
        for resume in resume_data:
            resume["resume_file"] = base64.b64decode(resume["resume_file"]).decode(errors="ignore")

        return {"resume_data": resume_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
