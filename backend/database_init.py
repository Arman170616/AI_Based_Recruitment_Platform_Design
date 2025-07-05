"""
Database initialization script
Run this to set up the database with sample data
"""

import sqlite3
import json
from datetime import datetime, timedelta
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def init_database():
    conn = sqlite3.connect('recruitment.db')
    cursor = conn.cursor()
    
    # Sample users
    users_data = [
        (1, "System Administrator", "admin@recruitment.com", hash_password("admin123"), "admin", "active", datetime.utcnow().isoformat(), None, json.dumps(["full_access", "user_management", "system_config"])),
        (2, "John Smith", "john.smith@company.com", hash_password("password123"), "recruiter", "active", datetime.utcnow().isoformat(), datetime.utcnow().isoformat(), json.dumps(["cv_upload", "candidate_review", "interview_schedule"])),
        (3, "Jane Doe", "jane.doe@company.com", hash_password("password123"), "hiring_manager", "active", datetime.utcnow().isoformat(), datetime.utcnow().isoformat(), json.dumps(["candidate_review", "interview_schedule", "final_decision"])),
    ]
    
    # Sample job positions
    job_positions_data = [
        (1, "Senior Frontend Developer", "Engineering", "Remote", "We are looking for an experienced frontend developer to join our team.", "active", datetime.utcnow().isoformat(), 1),
        (2, "Data Scientist", "Analytics", "New York", "Join our data science team to build ML models and analytics solutions.", "active", datetime.utcnow().isoformat(), 1),
        (3, "UX Designer", "Design", "San Francisco", "Create amazing user experiences for our products.", "active", datetime.utcnow().isoformat(), 1),
    ]
    
    # Sample job requirements
    job_requirements_data = [
        # Frontend Developer requirements
        (1, 1, "React", 90, True, "skill"),
        (2, 1, "TypeScript", 80, True, "skill"),
        (3, 1, "Next.js", 70, False, "skill"),
        (4, 1, "Tailwind CSS", 60, False, "skill"),
        (5, 1, "Node.js", 65, False, "skill"),
        
        # Data Scientist requirements
        (6, 2, "Python", 95, True, "skill"),
        (7, 2, "Machine Learning", 90, True, "skill"),
        (8, 2, "SQL", 80, True, "skill"),
        (9, 2, "TensorFlow", 70, False, "skill"),
        (10, 2, "Pandas", 75, False, "skill"),
        
        # UX Designer requirements
        (11, 3, "Figma", 85, True, "skill"),
        (12, 3, "Adobe Creative Suite", 75, False, "skill"),
        (13, 3, "User Research", 80, True, "skill"),
        (14, 3, "Prototyping", 70, False, "skill"),
    ]
    
    # Sample candidates
    candidates_data = [
        (1, "Sarah Johnson", "sarah.johnson@email.com", "+1-555-0101", 1, "uploads/sarah_cv.pdf", 
         json.dumps({
             "name": "Sarah Johnson",
             "email": "sarah.johnson@email.com",
             "phone": "+1-555-0101",
             "skills": ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "JavaScript", "HTML", "CSS"],
             "experience": "6 years",
             "education": "Bachelor's in Computer Science",
             "summary": "Experienced frontend developer with strong React skills"
         }), 92.0, 95.0, 88.0, 85.0, "shortlisted", datetime.utcnow().isoformat()),
        
        (2, "Michael Chen", "michael.chen@email.com", "+1-555-0102", 1, "uploads/michael_cv.pdf",
         json.dumps({
             "name": "Michael Chen",
             "email": "michael.chen@email.com",
             "phone": "+1-555-0102",
             "skills": ["React", "Vue.js", "JavaScript", "CSS", "Webpack", "Git"],
             "experience": "5 years",
             "education": "Master's in Software Engineering",
             "summary": "Full-stack developer with multi-framework experience"
         }), 88.0, 90.0, 85.0, 90.0, "reviewed", datetime.utcnow().isoformat()),
        
        (3, "Emily Rodriguez", "emily.rodriguez@email.com", "+1-555-0103", 1, "uploads/emily_cv.pdf",
         json.dumps({
             "name": "Emily Rodriguez",
             "email": "emily.rodriguez@email.com",
             "phone": "+1-555-0103",
             "skills": ["React", "Angular", "JavaScript", "SASS", "Jest", "Leadership"],
             "experience": "7 years",
             "education": "Bachelor's in Information Technology",
             "summary": "Senior developer with team leadership experience"
         }), 85.0, 82.0, 90.0, 80.0, "new", datetime.utcnow().isoformat()),
        
        (4, "David Kim", "david.kim@email.com", "+1-555-0104", 1, "uploads/david_cv.pdf",
         json.dumps({
             "name": "David Kim",
             "email": "david.kim@email.com",
             "phone": "+1-555-0104",
             "skills": ["JavaScript", "HTML", "CSS", "jQuery", "Bootstrap"],
             "experience": "4 years",
             "education": "Bachelor's in Computer Science",
             "summary": "Frontend developer with solid fundamentals"
         }), 78.0, 75.0, 80.0, 85.0, "new", datetime.utcnow().isoformat()),
        
        (5, "Dr. Lisa Wang", "lisa.wang@email.com", "+1-555-0105", 2, "uploads/lisa_cv.pdf",
         json.dumps({
             "name": "Dr. Lisa Wang",
             "email": "lisa.wang@email.com",
             "phone": "+1-555-0105",
             "skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Pandas", "NumPy", "Scikit-learn"],
             "experience": "8 years",
             "education": "PhD in Data Science",
             "summary": "Senior data scientist with extensive ML experience"
         }), 94.0, 96.0, 92.0, 95.0, "shortlisted", datetime.utcnow().isoformat()),
    ]
    
    # Sample interviews
    interviews_data = [
        (1, 1, 2, (datetime.utcnow() + timedelta(days=2)).isoformat(), 60, "video", None, "Technical interview focusing on React and TypeScript", "scheduled", datetime.utcnow().isoformat()),
        (2, 2, 3, (datetime.utcnow() + timedelta(days=4)).isoformat(), 45, "video", None, "Initial screening call", "confirmed", datetime.utcnow().isoformat()),
        (3, 5, 2, (datetime.utcnow() + timedelta(days=1)).isoformat(), 90, "video", None, "Technical interview for data science role", "scheduled", datetime.utcnow().isoformat()),
    ]
    
    try:
        # Insert sample data
        cursor.executemany("""
            INSERT OR REPLACE INTO users (id, name, email, password_hash, role, status, created_at, last_login, permissions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, users_data)
        
        cursor.executemany("""
            INSERT OR REPLACE INTO job_positions (id, title, department, location, description, status, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, job_positions_data)
        
        cursor.executemany("""
            INSERT OR REPLACE INTO job_requirements (id, job_position_id, skill, weight, mandatory, category)
            VALUES (?, ?, ?, ?, ?, ?)
        """, job_requirements_data)
        
        cursor.executemany("""
            INSERT OR REPLACE INTO candidates (id, name, email, phone, job_position_id, cv_file_path, parsed_data, overall_score, skills_score, experience_score, education_score, status, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, candidates_data)
        
        cursor.executemany("""
            INSERT OR REPLACE INTO interviews (id, candidate_id, interviewer_id, scheduled_date, duration, interview_type, location, notes, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, interviews_data)
        
        conn.commit()
        print("Database initialized successfully with sample data!")
        print("\nDefault login credentials:")
        print("Admin: admin@recruitment.com / admin123")
        print("Recruiter: john.smith@company.com / password123")
        print("Hiring Manager: jane.doe@company.com / password123")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    init_database()
