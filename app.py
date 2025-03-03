from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import io
import base64
from dotenv import load_dotenv
from PIL import Image
import pdf2image
import google.generativeai as genai
from auth import auth_router 

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize FastAPI app
app = FastAPI()

# Allow CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if frontend is running elsewhere
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


# Function to process PDF and return images
def input_pdf_setup(uploaded_file):
    if uploaded_file:
        # Convert the PDF to image
        images = pdf2image.convert_from_bytes(
            uploaded_file,
            poppler_path=r"F:\Poppler\poppler-24.08.0\Library\bin"  # Ensure correct Poppler path
        )
        first_page = images[0]

        # Convert to bytes
        img_byte_arr = io.BytesIO()
        first_page.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()

        pdf_parts = [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()  # Encode to base64
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
    job_description: str = Form(...),  # Ensure job_description is received correctly
    file: UploadFile = File(...)
):
    try:
        print(f"Received Job Description: {job_description}")  # Debugging
        print(f"Received File: {file.filename}")

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
          "STRENGTHS": [],  # Strengths of the resume
          "RECOMMENDATIONS": "",  # Recommendations for improvement
          "Missing Skills": [],  # Skills required in the JD but missing in the resume
          "Soft Skill Issues": [],  # Soft skills required in the JD but missing in the resume
          "Formatting Issues": [],  # Formatting issues in the resume
          "Keyword Issues": [],  # Missing or mismatched keywords
          "Bias Detection": "",  # Bias detected in the resume (if any)
          "Recruiter Tips": []  # Tips for the recruiter
        }}
        """

        # Get Gemini response
        response = get_gemini_response(input_prompt_structured, pdf_content, job_description)

        return {"analysis": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
