from sqlalchemy import Column, Integer, LargeBinary, String, ForeignKey, TIMESTAMP, Text, func, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'user')", name="role_check"),
    )

class UserDetails(Base):
    __tablename__ = "user_details"

    id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    department = Column(String(50), nullable=False)
    year = Column(String(10), nullable=False)
    college_name = Column(String(100), server_default="PES's Modern College Of Engineering, Pune")


class ScannedResume(Base):
    __tablename__ = "scanned_resumes"

    resume_id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_name = Column(String(255), nullable=False)
    resume_file = Column(LargeBinary, nullable=False)  # Stores the PDF file
    scanned_at = Column(TIMESTAMP, server_default=func.now())
    job_id = Column(Integer, autoincrement=True)
    job_description = Column(Text, nullable=False)

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, autoincrement=True)
    course_name = Column(String(255), nullable=False)
    course_source = Column(String(100), nullable=False)
    course_category = Column(String(100), nullable=False)
    course_link = Column(Text, nullable=False)