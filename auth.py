from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel

# JWT Secret Key & Algorithm
SECRET_KEY = "c587ee0dd8cc5a7c23de162a36f10d4c12d4fd776f488ccf90e4ee38000c4467"  # Change this to a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expires in 1 hour

# Database connection
DB_NAME = "skillfit_ai"
DB_USER = "postgres"
DB_PASSWORD = "6969"
DB_HOST = "localhost"
DB_PORT = "5432"

# Create a connection to PostgreSQL
conn = psycopg2.connect(
    dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT, cursor_factory=RealDictCursor
)
cursor = conn.cursor()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Router instance
auth_router = APIRouter()

# Function to verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to hash password
def hash_password(password):
    return pwd_context.hash(password)

# Function to create access tokens
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Signup endpoint
class SignUpRequest(BaseModel):
    full_name: str
    email: str
    password: str
    department: str
    year: str
    role: str = "user"

@auth_router.post("/signup")
def signup(user: SignUpRequest):
    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        hashed_password = hash_password(user.password)
        
        # Insert into users table
        cursor.execute(
            "INSERT INTO users (email, password_hash, role) VALUES (%s, %s, %s) RETURNING id",
            (user.email, hashed_password, user.role),
        )
        user_id = cursor.fetchone()["id"]

        # Insert into user_details table
        cursor.execute(
            "INSERT INTO user_details (id, full_name, email, department, year) VALUES (%s, %s, %s, %s, %s)",
            (user_id, user.full_name, user.email, user.department, user.year),
        )

        conn.commit()
        return {"message": "Signup successful"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

# Login endpoint
@auth_router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username  # OAuth2PasswordRequestForm uses 'username' instead of 'email'
    password = form_data.password

    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password required")

    cursor.execute("SELECT id, email, password_hash, role FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})

    return {"access_token": access_token, "token_type": "bearer"}

# Admin dashboard route
@auth_router.get("/admin-dashboard")
def admin_dashboard(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return {"message": "Welcome to the admin dashboard"}

# User upload route
@auth_router.get("/upload-resume")
def user_upload(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    if payload.get("role") != "user":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return {"message": "Upload your resume here"}


@auth_router.get("/get-user-details")
def get_user_details(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        cursor.execute("SELECT full_name FROM user_details WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"full_name": user["full_name"]}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
