# SkillFit AI

An AI-powered Resume Analysis and Course Recommendation System that helps students improve their resumes and find relevant courses based on their skills gap.

## Features

- Resume Analysis with AI (powered by Google's Gemini API)
- Course Recommendations
- Student Management
- Admin Dashboard
- User Authentication
- Password Reset via Email

## Tech Stack

### Backend
- Python
- FastAPI
- PostgreSQL
- JWT Authentication
- Google Gemini API

### Frontend
- React
- Material-UI
- Axios
- React Router

## Setup Instructions

### Backend Setup

1. Create a PostgreSQL database named `skillfit_ai`

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
- Create a `.env` file in the root directory
- Add the following variables:
  ```
  GOOGLE_API_KEY=your_gemini_api_key
  EMAIL_PASSWORD=your_email_app_password
  ```

4. Run the backend server:
```bash
uvicorn app:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd skillfit.ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses the following tables:
- users
- user_details
- courses
- scanned_resumes
- analysis_results
- password_resets

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 