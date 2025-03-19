from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import io
import base64
from dotenv import load_dotenv
from PIL import Image
import pdf2image
import google.generativeai as genai
import jwt
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from sqlalchemy import func
from auth import auth_router, oauth2_scheme, SECRET_KEY, ALGORITHM

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize FastAPI app
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# Database connection
DB_NAME = "skillfit_ai"
DB_USER = "postgres"
DB_PASSWORD = "6969"
DB_HOST = "localhost"
DB_PORT = "5432"

conn = psycopg2.connect(
    dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT, cursor_factory=RealDictCursor
)
cursor = conn.cursor()

# Function to extract user_id from JWT token
def get_user_id_from_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user["id"]

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Function to process PDF and return images
def input_pdf_setup(uploaded_file):
    if uploaded_file:
        images = pdf2image.convert_from_bytes(
            uploaded_file,
            poppler_path=r"F:\Poppler\poppler-24.08.0\Library\bin"
        )
        first_page = images[0]

        img_byte_arr = io.BytesIO()
        first_page.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()

        pdf_parts = [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()
            }
        ]
        return pdf_parts
    else:
        raise HTTPException(status_code=400, detail="No file uploaded")

# Function to get Gemini response
def get_gemini_response(input_prompt, pdf_content, job_description):
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content([input_prompt, pdf_content[0], job_description])
    return response.text

# Define the API endpoint
@app.post("/analyze-resume")
async def analyze_resume(
    job_description: str = Form(...),
    file: UploadFile = File(...),
    user_id: int = Depends(get_user_id_from_token)  # Extract user ID from token
):
    try:
        print(f"Received Job Description: {job_description}")
        print(f"Received File: {file.filename}")
        print(f"User ID: {user_id}")  # Debugging

        # Read the uploaded file
        file_content = await file.read()

        # Process the PDF
        pdf_content = input_pdf_setup(file_content)

        # Define the prompt
        input_prompt_structured = f"""
        Hey, act like a skilled or very experienced ATS (Application Tracking System)
        with a deep understanding of the tech field, software engineering, data science, data analyst,
        and big data engineering. Your task is to evaluate the resume based on the given job description.
        You must consider that the job market is very competitive, and you should provide 
        the best assistance for improving the resume. Assign the percentage matching based 
        on the job description and identify the missing keywords with high accuracy.

        Resume: (Extracted from PDF)
        Job Description: {job_description}

        I want the response in one single string having the following structure:
        {{
          "JD Match": "% Match Score",
          "Profile Summary": "",
          "STRENGTHS": [],
          "RECOMMENDATIONS": "",
          "Missing Skills": [],
          "Soft Skill Issues": [],
          "Formatting Issues": [],
          "Keyword Issues": [],
          "Bias Detection": "",
          "Recruiter Tips": []
        }}
        """

        # Get Gemini response
        response = get_gemini_response(input_prompt_structured, pdf_content, job_description)

        # Remove any markdown formatting if present
        cleaned_response = response.replace("```json", "").replace("```", "").strip()
        analysis_json = json.loads(cleaned_response)

        # Store resume and job description in database
        cursor.execute(
            """
            INSERT INTO scanned_resumes (id, resume_name, resume_file, job_description)
            VALUES (%s, %s, %s, %s)
            RETURNING resume_id, job_id
            """,
            (user_id, file.filename, file_content, job_description)
        )

        resume_data = cursor.fetchone()
        resume_id = resume_data["resume_id"]
        job_id = resume_data["job_id"]

        # Extract match score as float
        match_score = float(analysis_json["JD Match"].replace("%", ""))
        
        # Insert analysis results into database
        cursor.execute(
            """
            INSERT INTO analysis_results (
                id, resume_id, job_id, match_score, profile_summary,
                strengths, recommendations, missing_skills, soft_skill_issues,
                formatting_issues, keyword_issues, bias_detection, recruiter_tips
            )
            VALUES (%s, %s, %s, %s, %s, %s::jsonb, %s, %s::jsonb, %s::jsonb, %s::jsonb, %s::jsonb, %s, %s::jsonb)
            """,
            (
                user_id,
                resume_id,
                job_id,
                match_score,
                analysis_json["Profile Summary"],
                json.dumps(analysis_json["STRENGTHS"]),  # Convert array to jsonb
                analysis_json["RECOMMENDATIONS"],
                json.dumps(analysis_json["Missing Skills"]),  # Convert array to jsonb
                json.dumps(analysis_json["Soft Skill Issues"]),  # Convert array to jsonb
                json.dumps(analysis_json["Formatting Issues"]),  # Convert array to jsonb
                json.dumps(analysis_json["Keyword Issues"]),  # Convert array to jsonb
                analysis_json["Bias Detection"],
                json.dumps(analysis_json["Recruiter Tips"])  # Convert array to jsonb
            )
        )

        conn.commit()

        # Return both the parsed JSON and the original response
        return {
            "analysis": analysis_json,
            "raw_response": response,
            "message": "Resume scanned and analysis stored successfully"
        }

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        print(f"Raw response: {response}")
        raise HTTPException(status_code=500, detail="Error parsing analysis results. Please try again.")
    except Exception as e:
        conn.rollback()
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin Dashboard Endpoints
@app.get("/admin/dashboard-stats")
async def get_dashboard_stats(user_id: int = Depends(get_user_id_from_token)):
    try:
        # Verify if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_role = cursor.fetchone()["role"]
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        # KPI Cards
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("SELECT COUNT(*) as total_resumes FROM scanned_resumes")
        total_resumes = cursor.fetchone()["total_resumes"]

        cursor.execute("SELECT COUNT(DISTINCT job_id) as total_jobs FROM scanned_resumes")
        total_jobs = cursor.fetchone()["total_jobs"]

        cursor.execute("SELECT AVG(match_score) as avg_match_rate FROM analysis_results")
        avg_match_rate = cursor.fetchone()["avg_match_rate"]

        cursor.execute("""
            SELECT ud.department, COUNT(DISTINCT sr.id) as scan_count
            FROM user_details ud
            LEFT JOIN scanned_resumes sr ON ud.id = sr.id
            WHERE ud.department != 'N/A'
            GROUP BY ud.department
            ORDER BY scan_count DESC
            LIMIT 1
        """)
        top_department = cursor.fetchone()["department"]

        # Charts
        cursor.execute("""
            SELECT DATE_TRUNC('month', scanned_at) as month,
                   COUNT(*) as count
            FROM scanned_resumes
            GROUP BY month
            ORDER BY month DESC
            LIMIT 6
        """)
        resume_scans = cursor.fetchall()

        cursor.execute("""
            SELECT ud.department, STRING_AGG(ud.full_name, ', ') as students
            FROM user_details ud
            JOIN users u ON ud.id = u.id
            GROUP BY ud.department
            ORDER BY ud.department
        """)
        students_by_department = cursor.fetchall()

        cursor.execute("""
            SELECT ud.full_name, MAX(ar.match_score) as highest_match_score
            FROM analysis_results ar
            JOIN users u ON ar.id = u.id
            JOIN user_details ud ON u.id = ud.id
            GROUP BY ud.full_name
            ORDER BY highest_match_score DESC
            LIMIT 5
        """)
        top_students = cursor.fetchall()

        cursor.execute("""
            SELECT ud.department, COUNT(sr.resume_id) as resume_count
            FROM user_details ud
            JOIN scanned_resumes sr ON ud.id = sr.id
            GROUP BY ud.department
            ORDER BY resume_count DESC
        """)
        resumes_by_department = cursor.fetchall()

        return {
            "kpi": {
                "total_users": total_users,
                "total_resumes": total_resumes,
                "total_jobs": total_jobs,
                "avg_match_rate": avg_match_rate,
                "top_department": top_department
            },
            "charts": {
                "resume_scans": resume_scans,
                "students_by_department": students_by_department,
                "top_students": top_students,
                "resumes_by_department": resumes_by_department
            }
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin endpoints for student management
@app.get("/admin/students")
async def get_students(
    department: str = None,
    year: str = None,
    user_id: int = Depends(get_user_id_from_token)
):
    try:
        # Verify if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_role = cursor.fetchone()["role"]
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        # Build the query based on filters
        query = """
            SELECT u.id, ud.full_name, u.email, ud.department, ud.year, ud.college_name
            FROM users u
            INNER JOIN user_details ud ON u.id = ud.id
            WHERE u.role = 'user'
        """
        params = []

        if department and department != 'All':
            query += " AND ud.department LIKE %s"
            params.append(f"%{department}%")  # Use LIKE for partial matches
        
        if year and year != 'All':
            query += " AND ud.year = %s"
            params.append(year)

        query += " ORDER BY ud.full_name"

        cursor.execute(query, tuple(params) if params else None)
        students = cursor.fetchall()
        
        if not students:
            return []
            
        return students

    except Exception as e:
        print(f"Error in get_students: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/delete-student/{student_id}")
async def delete_student(
    student_id: int,
    user_id: int = Depends(get_user_id_from_token)
):
    try:
        # Verify if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_role = cursor.fetchone()["role"]
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        # Start transaction
        cursor.execute("BEGIN")

        # Delete from analysis_results
        cursor.execute("DELETE FROM analysis_results WHERE id = %s", (student_id,))

        # Delete from scanned_resumes
        cursor.execute("DELETE FROM scanned_resumes WHERE id = %s", (student_id,))

        # Delete from user_details
        cursor.execute("DELETE FROM user_details WHERE id = %s", (student_id,))

        # Delete from users
        cursor.execute("DELETE FROM users WHERE id = %s", (student_id,))

        # Commit transaction
        conn.commit()

        return {"message": "Student data deleted successfully"}

    except Exception as e:
        conn.rollback()
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# User scan history endpoint
@app.get("/scan-history")
async def get_scan_history(user_id: int = Depends(get_user_id_from_token)):
    try:
        cursor.execute("""
            SELECT 
                sr.resume_id,
                sr.resume_name,
                sr.job_description,
                sr.scanned_at,
                COALESCE(ar.match_score, 0) as match_score
            FROM scanned_resumes sr
            LEFT JOIN analysis_results ar 
                ON sr.resume_id = ar.resume_id 
                AND sr.job_id = ar.job_id
                AND sr.id = ar.id
            WHERE sr.id = %s
            ORDER BY sr.scanned_at DESC
        """, (user_id,))
        
        scan_history = cursor.fetchall()
        
        # Format the response data
        formatted_history = []
        for record in scan_history:
            formatted_history.append({
                'resume_id': record['resume_id'],
                'resume_name': record['resume_name'],
                'job_description': record['job_description'],
                'match_score': float(record['match_score']) if record['match_score'] else 0,
                'scanned_at': record['scanned_at'].isoformat() if record['scanned_at'] else None
            })
        
        return formatted_history

    except Exception as e:
        print(f"Error fetching scan history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Course management endpoints
@app.get("/courses")
async def get_courses(
    category: str = None,
    page: int = 1,
    limit: int = 10,
    user_id: int = Depends(get_user_id_from_token)
):
    try:
        offset = (page - 1) * limit
        
        # Build the query based on category filter
        query = "SELECT * FROM courses"
        count_query = "SELECT COUNT(*) as total FROM courses"
        params = []
        
        if category and category != 'All':
            query += " WHERE course_category = %s"
            count_query += " WHERE course_category = %s"
            params.append(category)
            
        # Add ordering and pagination
        query += " ORDER BY course_id DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        # Get total count
        cursor.execute(count_query, params[:-2] if params else None)
        total = cursor.fetchone()["total"]
        
        # Get paginated results
        cursor.execute(query, params)
        courses = cursor.fetchall()
        
        return {
            "courses": courses,
            "total": total
        }

    except Exception as e:
        print(f"Error fetching courses: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/courses")
async def add_course(
    course: dict,
    user_id: int = Depends(get_user_id_from_token)
):
    try:
        # Verify if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_role = cursor.fetchone()["role"]
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        cursor.execute(
            """
            INSERT INTO courses (course_name, course_source, course_category, course_link)
            VALUES (%s, %s, %s, %s)
            RETURNING course_id
            """,
            (
                course["course_name"],
                course["course_source"],
                course["course_category"],
                course["course_link"]
            )
        )
        
        new_course_id = cursor.fetchone()["course_id"]
        conn.commit()
        
        return {"course_id": new_course_id, "message": "Course added successfully"}

    except Exception as e:
        conn.rollback()
        print(f"Error adding course: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/courses/{course_id}")
async def delete_course(
    course_id: int,
    user_id: int = Depends(get_user_id_from_token)
):
    try:
        # Verify if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_role = cursor.fetchone()["role"]
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        cursor.execute("DELETE FROM courses WHERE course_id = %s", (course_id,))
        conn.commit()
        
        return {"message": "Course deleted successfully"}

    except Exception as e:
        conn.rollback()
        print(f"Error deleting course: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
