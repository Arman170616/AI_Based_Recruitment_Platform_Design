from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import sqlite3
import json
import hashlib
import jwt
import os
from pathlib import Path
import uuid
import asyncio
from io import BytesIO
import PyPDF2
import docx
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./recruitment.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"

app = FastAPI(
    title="AI Recruitment Platform API",
    description="Comprehensive API for AI-powered recruitment automation system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin, recruiter, hiring_manager
    status = Column(String, default="active")  # active, inactive
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    permissions = Column(Text)  # JSON string

class JobPosition(Base):
    __tablename__ = "job_positions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="active")  # active, draft, closed
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    requirements = relationship("JobRequirement", back_populates="job_position")
    candidates = relationship("Candidate", back_populates="job_position")

class JobRequirement(Base):
    __tablename__ = "job_requirements"
    
    id = Column(Integer, primary_key=True, index=True)
    job_position_id = Column(Integer, ForeignKey("job_positions.id"))
    skill = Column(String, nullable=False)
    weight = Column(Integer, default=50)  # 0-100
    mandatory = Column(Boolean, default=False)
    category = Column(String, default="skill")  # skill, experience, education
    
    # Relationships
    job_position = relationship("JobPosition", back_populates="requirements")

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    job_position_id = Column(Integer, ForeignKey("job_positions.id"))
    cv_file_path = Column(String)
    parsed_data = Column(Text)  # JSON string
    overall_score = Column(Float, default=0.0)
    skills_score = Column(Float, default=0.0)
    experience_score = Column(Float, default=0.0)
    education_score = Column(Float, default=0.0)
    status = Column(String, default="new")  # new, reviewed, shortlisted, rejected, interviewed
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job_position = relationship("JobPosition", back_populates="candidates")
    interviews = relationship("Interview", back_populates="candidate")

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    interviewer_id = Column(Integer, ForeignKey("users.id"))
    scheduled_date = Column(DateTime, nullable=False)
    duration = Column(Integer, default=60)  # minutes
    interview_type = Column(String, default="video")  # video, phone, in-person
    location = Column(String)
    notes = Column(Text)
    status = Column(String, default="scheduled")  # scheduled, confirmed, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="interviews")
    interviewer = relationship("User")

class SystemMetric(Base):
    __tablename__ = "system_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, nullable=False)
    metric_value = Column(String, nullable=False)
    metric_change = Column(String)
    status = Column(String, default="good")  # good, warning, error
    recorded_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    resource_id = Column(String)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    permissions: List[str] = []

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    created_at: datetime
    last_login: Optional[datetime]
    permissions: List[str]

class JobPositionCreate(BaseModel):
    title: str
    department: str
    location: str
    description: str
    requirements: List[Dict[str, Any]] = []

class JobPositionResponse(BaseModel):
    id: int
    title: str
    department: str
    location: str
    description: str
    status: str
    created_at: datetime
    requirements: List[Dict[str, Any]]

class CandidateResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    job_position_id: int
    overall_score: float
    skills_score: float
    experience_score: float
    education_score: float
    status: str
    uploaded_at: datetime
    parsed_data: Dict[str, Any]

class InterviewCreate(BaseModel):
    candidate_id: int
    interviewer_id: int
    scheduled_date: datetime
    duration: int = 60
    interview_type: str = "video"
    location: Optional[str] = None
    notes: Optional[str] = None

class InterviewResponse(BaseModel):
    id: int
    candidate_id: int
    interviewer_id: int
    scheduled_date: datetime
    duration: int
    interview_type: str
    location: Optional[str]
    notes: Optional[str]
    status: str
    created_at: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# CV Parsing functions
def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    try:
        doc = docx.Document(BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")

def parse_cv_content(text: str) -> Dict[str, Any]:
    """Simple CV parsing logic - in production, use advanced NLP models"""
    parsed_data = {
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "experience": "",
        "education": "",
        "summary": ""
    }
    
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    if emails:
        parsed_data["email"] = emails[0]
    
    # Extract phone
    phone_pattern = r'[\+]?[1-9]?[0-9]{7,15}'
    phones = re.findall(phone_pattern, text)
    if phones:
        parsed_data["phone"] = phones[0]
    
    # Extract skills (simple keyword matching)
    skill_keywords = [
        "Python", "JavaScript", "React", "Node.js", "SQL", "MongoDB", "AWS", "Docker",
        "Kubernetes", "Git", "HTML", "CSS", "TypeScript", "Vue.js", "Angular", "Django",
        "Flask", "Express", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "GraphQL",
        "REST API", "Microservices", "Machine Learning", "Data Science", "TensorFlow",
        "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Java", "C++", "C#", ".NET",
        "Spring Boot", "Hibernate", "Maven", "Gradle", "Jenkins", "CI/CD", "Agile",
        "Scrum", "Leadership", "Project Management", "Communication", "Problem Solving"
    ]
    
    found_skills = []
    text_upper = text.upper()
    for skill in skill_keywords:
        if skill.upper() in text_upper:
            found_skills.append(skill)
    
    parsed_data["skills"] = found_skills[:10]  # Limit to top 10 skills
    
    # Extract name (first line that looks like a name)
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if len(line) > 2 and len(line) < 50 and ' ' in line and not '@' in line:
            parsed_data["name"] = line
            break
    
    # Extract experience (years)
    exp_pattern = r'(\d+)[\+]?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)'
    exp_matches = re.findall(exp_pattern, text.lower())
    if exp_matches:
        parsed_data["experience"] = f"{max(map(int, exp_matches))} years"
    
    # Extract education
    education_keywords = ["bachelor", "master", "phd", "degree", "university", "college", "diploma"]
    for keyword in education_keywords:
        if keyword.lower() in text.lower():
            # Find the line containing education info
            for line in text.split('\n'):
                if keyword.lower() in line.lower():
                    parsed_data["education"] = line.strip()
                    break
            break
    
    return parsed_data

def calculate_candidate_score(candidate_data: Dict[str, Any], job_requirements: List[JobRequirement]) -> Dict[str, float]:
    """Calculate AI-based scoring for candidate"""
    scores = {
        "overall_score": 0.0,
        "skills_score": 0.0,
        "experience_score": 0.0,
        "education_score": 0.0
    }
    
    if not job_requirements:
        return scores
    
    candidate_skills = [skill.lower() for skill in candidate_data.get("skills", [])]
    
    # Calculate skills score
    skill_requirements = [req for req in job_requirements if req.category == "skill"]
    if skill_requirements:
        skill_matches = 0
        total_weight = 0
        
        for req in skill_requirements:
            total_weight += req.weight
            if req.skill.lower() in candidate_skills:
                skill_matches += req.weight
        
        scores["skills_score"] = (skill_matches / total_weight * 100) if total_weight > 0 else 0
    
    # Calculate experience score (simplified)
    experience_text = candidate_data.get("experience", "")
    if "year" in experience_text.lower():
        try:
            years = int(re.findall(r'\d+', experience_text)[0])
            scores["experience_score"] = min(years * 15, 100)  # 15 points per year, max 100
        except:
            scores["experience_score"] = 50
    else:
        scores["experience_score"] = 30
    
    # Calculate education score (simplified)
    education_text = candidate_data.get("education", "").lower()
    if "master" in education_text or "phd" in education_text:
        scores["education_score"] = 90
    elif "bachelor" in education_text or "degree" in education_text:
        scores["education_score"] = 75
    elif "diploma" in education_text:
        scores["education_score"] = 60
    else:
        scores["education_score"] = 40
    
    # Calculate overall score (weighted average)
    scores["overall_score"] = (
        scores["skills_score"] * 0.5 +
        scores["experience_score"] * 0.3 +
        scores["education_score"] * 0.2
    )
    
    return scores

# API Routes

@app.post("/auth/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email})
    
    permissions = json.loads(user.permissions) if user.permissions else []
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            status=user.status,
            created_at=user.created_at,
            last_login=user.last_login,
            permissions=permissions
        )
    )

@app.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role,
        permissions=json.dumps(user_data.permissions)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        status=new_user.status,
        created_at=new_user.created_at,
        last_login=new_user.last_login,
        permissions=user_data.permissions
    )

@app.get("/users", response_model=List[UserResponse])
async def get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = db.query(User).all()
    return [
        UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            status=user.status,
            created_at=user.created_at,
            last_login=user.last_login,
            permissions=json.loads(user.permissions) if user.permissions else []
        )
        for user in users
    ]

@app.post("/job-positions", response_model=JobPositionResponse)
async def create_job_position(
    job_data: JobPositionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create job position
    new_job = JobPosition(
        title=job_data.title,
        department=job_data.department,
        location=job_data.location,
        description=job_data.description,
        created_by=current_user.id
    )
    
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    # Add requirements
    for req_data in job_data.requirements:
        requirement = JobRequirement(
            job_position_id=new_job.id,
            skill=req_data["skill"],
            weight=req_data.get("weight", 50),
            mandatory=req_data.get("mandatory", False),
            category=req_data.get("category", "skill")
        )
        db.add(requirement)
    
    db.commit()
    
    # Return with requirements
    requirements = db.query(JobRequirement).filter(JobRequirement.job_position_id == new_job.id).all()
    
    return JobPositionResponse(
        id=new_job.id,
        title=new_job.title,
        department=new_job.department,
        location=new_job.location,
        description=new_job.description,
        status=new_job.status,
        created_at=new_job.created_at,
        requirements=[
            {
                "skill": req.skill,
                "weight": req.weight,
                "mandatory": req.mandatory,
                "category": req.category
            }
            for req in requirements
        ]
    )

@app.get("/job-positions", response_model=List[JobPositionResponse])
async def get_job_positions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = db.query(JobPosition).all()
    result = []
    
    for job in jobs:
        requirements = db.query(JobRequirement).filter(JobRequirement.job_position_id == job.id).all()
        result.append(JobPositionResponse(
            id=job.id,
            title=job.title,
            department=job.department,
            location=job.location,
            description=job.description,
            status=job.status,
            created_at=job.created_at,
            requirements=[
                {
                    "skill": req.skill,
                    "weight": req.weight,
                    "mandatory": req.mandatory,
                    "category": req.category
                }
                for req in requirements
            ]
        ))
    
    return result

@app.post("/candidates/upload-cv")
async def upload_cv(
    file: UploadFile = File(...),
    job_position_id: int = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, DOCX, and TXT files are allowed.")
    
    # Read file content
    file_content = await file.read()
    
    # Extract text based on file type
    if file.content_type == "application/pdf":
        text = extract_text_from_pdf(file_content)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        text = extract_text_from_docx(file_content)
    else:  # text/plain
        text = file_content.decode('utf-8')
    
    # Parse CV content
    parsed_data = parse_cv_content(text)
    
    # Get job requirements for scoring
    job_requirements = db.query(JobRequirement).filter(JobRequirement.job_position_id == job_position_id).all()
    
    # Calculate scores
    scores = calculate_candidate_score(parsed_data, job_requirements)
    
    # Save file (in production, use cloud storage)
    file_path = f"uploads/{uuid.uuid4()}_{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    # Create candidate record
    candidate = Candidate(
        name=parsed_data.get("name", "Unknown"),
        email=parsed_data.get("email", ""),
        phone=parsed_data.get("phone", ""),
        job_position_id=job_position_id,
        cv_file_path=file_path,
        parsed_data=json.dumps(parsed_data),
        overall_score=scores["overall_score"],
        skills_score=scores["skills_score"],
        experience_score=scores["experience_score"],
        education_score=scores["education_score"]
    )
    
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    
    return {
        "message": "CV uploaded and processed successfully",
        "candidate_id": candidate.id,
        "parsed_data": parsed_data,
        "scores": scores
    }

@app.get("/candidates", response_model=List[CandidateResponse])
async def get_candidates(
    job_position_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Candidate)
    
    if job_position_id:
        query = query.filter(Candidate.job_position_id == job_position_id)
    
    if status:
        query = query.filter(Candidate.status == status)
    
    if min_score:
        query = query.filter(Candidate.overall_score >= min_score)
    
    candidates = query.order_by(Candidate.overall_score.desc()).all()
    
    return [
        CandidateResponse(
            id=candidate.id,
            name=candidate.name,
            email=candidate.email,
            phone=candidate.phone,
            job_position_id=candidate.job_position_id,
            overall_score=candidate.overall_score,
            skills_score=candidate.skills_score,
            experience_score=candidate.experience_score,
            education_score=candidate.education_score,
            status=candidate.status,
            uploaded_at=candidate.uploaded_at,
            parsed_data=json.loads(candidate.parsed_data) if candidate.parsed_data else {}
        )
        for candidate in candidates
    ]

@app.put("/candidates/{candidate_id}/status")
async def update_candidate_status(
    candidate_id: int,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    valid_statuses = ["new", "reviewed", "shortlisted", "rejected", "interviewed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    candidate.status = status
    db.commit()
    
    return {"message": "Candidate status updated successfully"}

@app.post("/interviews", response_model=InterviewResponse)
async def create_interview(
    interview_data: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify candidate exists
    candidate = db.query(Candidate).filter(Candidate.id == interview_data.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Verify interviewer exists
    interviewer = db.query(User).filter(User.id == interview_data.interviewer_id).first()
    if not interviewer:
        raise HTTPException(status_code=404, detail="Interviewer not found")
    
    # Create interview
    interview = Interview(
        candidate_id=interview_data.candidate_id,
        interviewer_id=interview_data.interviewer_id,
        scheduled_date=interview_data.scheduled_date,
        duration=interview_data.duration,
        interview_type=interview_data.interview_type,
        location=interview_data.location,
        notes=interview_data.notes
    )
    
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    return InterviewResponse(
        id=interview.id,
        candidate_id=interview.candidate_id,
        interviewer_id=interview.interviewer_id,
        scheduled_date=interview.scheduled_date,
        duration=interview.duration,
        interview_type=interview.interview_type,
        location=interview.location,
        notes=interview.notes,
        status=interview.status,
        created_at=interview.created_at
    )

@app.get("/interviews", response_model=List[InterviewResponse])
async def get_interviews(
    candidate_id: Optional[int] = Query(None),
    interviewer_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Interview)
    
    if candidate_id:
        query = query.filter(Interview.candidate_id == candidate_id)
    
    if interviewer_id:
        query = query.filter(Interview.interviewer_id == interviewer_id)
    
    if status:
        query = query.filter(Interview.status == status)
    
    interviews = query.order_by(Interview.scheduled_date).all()
    
    return [
        InterviewResponse(
            id=interview.id,
            candidate_id=interview.candidate_id,
            interviewer_id=interview.interviewer_id,
            scheduled_date=interview.scheduled_date,
            duration=interview.duration,
            interview_type=interview.interview_type,
            location=interview.location,
            notes=interview.notes,
            status=interview.status,
            created_at=interview.created_at
        )
        for interview in interviews
    ]

@app.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get various statistics
    total_candidates = db.query(Candidate).count()
    total_jobs = db.query(JobPosition).filter(JobPosition.status == "active").count()
    shortlisted_candidates = db.query(Candidate).filter(Candidate.status == "shortlisted").count()
    scheduled_interviews = db.query(Interview).filter(Interview.status == "scheduled").count()
    
    # Recent candidates
    recent_candidates = db.query(Candidate).order_by(Candidate.uploaded_at.desc()).limit(5).all()
    
    # Average score
    avg_score_result = db.query(Candidate).all()
    avg_score = sum(c.overall_score for c in avg_score_result) / len(avg_score_result) if avg_score_result else 0
    
    return {
        "total_candidates": total_candidates,
        "active_jobs": total_jobs,
        "shortlisted_candidates": shortlisted_candidates,
        "scheduled_interviews": scheduled_interviews,
        "average_score": round(avg_score, 1),
        "recent_candidates": [
            {
                "id": c.id,
                "name": c.name,
                "position": c.job_position.title if c.job_position else "Unknown",
                "score": c.overall_score,
                "status": c.status,
                "uploaded_at": c.uploaded_at.isoformat()
            }
            for c in recent_candidates
        ]
    }

@app.get("/system/metrics")
async def get_system_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get or create system metrics
    metrics = [
        {"name": "System Uptime", "value": "99.9%", "change": "+0.1%", "status": "good"},
        {"name": "AI Processing Speed", "value": "2.3s avg", "change": "-0.2s", "status": "good"},
        {"name": "Database Size", "value": "2.4 GB", "change": "+120 MB", "status": "good"},
        {"name": "Active Users", "value": str(db.query(User).filter(User.status == "active").count()), "change": "+3", "status": "good"},
        {"name": "API Response Time", "value": "145ms", "change": "+12ms", "status": "warning"},
        {"name": "Error Rate", "value": "0.02%", "change": "+0.01%", "status": "warning"}
    ]
    
    return {"metrics": metrics}

@app.post("/ai/chat")
async def ai_chat(
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Simple AI chatbot responses - in production, integrate with OpenAI or similar"""
    
    message_lower = message.lower()
    
    if "sarah johnson" in message_lower:
        candidate = db.query(Candidate).filter(Candidate.name.ilike("%sarah johnson%")).first()
        if candidate:
            parsed_data = json.loads(candidate.parsed_data) if candidate.parsed_data else {}
            response = f"Sarah Johnson has a {candidate.overall_score:.0f}% match score. Skills: {', '.join(parsed_data.get('skills', [])[:5])}. Experience: {parsed_data.get('experience', 'Not specified')}."
        else:
            response = "I couldn't find information about Sarah Johnson in our database."
    
    elif "top candidates" in message_lower or "best candidates" in message_lower:
        top_candidates = db.query(Candidate).order_by(Candidate.overall_score.desc()).limit(3).all()
        if top_candidates:
            response = "Top candidates:\n"
            for i, candidate in enumerate(top_candidates, 1):
                response += f"{i}. {candidate.name} ({candidate.overall_score:.0f}%)\n"
        else:
            response = "No candidates found in the database."
    
    elif "score" in message_lower or "scoring" in message_lower:
        response = "Our AI scoring evaluates candidates on skills match (50%), experience (30%), and education (20%). Scores above 70% are excellent matches."
    
    elif "report" in message_lower:
        response = "I can help generate reports for candidate analysis, hiring pipeline, and interview scheduling. What specific report would you like?"
    
    else:
        response = "I can help you with candidate information, scoring details, and recruitment insights. Try asking about specific candidates, top performers, or generating reports."
    
    return {
        "response": response,
        "suggestions": [
            "Show me top candidates",
            "What is the average candidate score?",
            "How many interviews are scheduled?",
            "Generate a hiring report"
        ]
    }

@app.get("/candidates/{candidate_id}/report")
async def generate_candidate_report(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    parsed_data = json.loads(candidate.parsed_data) if candidate.parsed_data else {}
    job_position = db.query(JobPosition).filter(JobPosition.id == candidate.job_position_id).first()
    
    # Generate strengths and weaknesses
    strengths = []
    weaknesses = []
    
    if candidate.skills_score >= 80:
        strengths.append("Strong technical skills match")
    elif candidate.skills_score < 50:
        weaknesses.append("Limited relevant technical skills")
    
    if candidate.experience_score >= 80:
        strengths.append("Extensive relevant experience")
    elif candidate.experience_score < 50:
        weaknesses.append("Limited professional experience")
    
    if candidate.education_score >= 80:
        strengths.append("Strong educational background")
    elif candidate.education_score < 50:
        weaknesses.append("Basic educational qualifications")
    
    return {
        "candidate": {
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email,
            "phone": candidate.phone,
            "position": job_position.title if job_position else "Unknown"
        },
        "scores": {
            "overall": candidate.overall_score,
            "skills": candidate.skills_score,
            "experience": candidate.experience_score,
            "education": candidate.education_score
        },
        "parsed_data": parsed_data,
        "analysis": {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendation": "Highly recommended" if candidate.overall_score >= 80 else "Recommended" if candidate.overall_score >= 60 else "Consider with caution"
        },
        "generated_at": datetime.utcnow().isoformat()
    }

# Initialize default admin user
@app.on_event("startup")
async def create_default_admin():
    db = SessionLocal()
    try:
        # Check if admin exists
        admin = db.query(User).filter(User.email == "admin@recruitment.com").first()
        if not admin:
            admin_user = User(
                name="System Administrator",
                email="admin@recruitment.com",
                password_hash=hash_password("admin123"),
                role="admin",
                permissions=json.dumps(["full_access", "user_management", "system_config"])
            )
            db.add(admin_user)
            db.commit()
            print("Default admin user created: admin@recruitment.com / admin123")
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
