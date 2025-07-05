"""
Advanced CV parsing utilities
"""

import re
import json
from typing import Dict, List, Any
import spacy
from datetime import datetime

# Load spaCy model (install with: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

class AdvancedCVParser:
    def __init__(self):
        self.skill_keywords = {
            "programming": [
                "Python", "JavaScript", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin",
                "TypeScript", "PHP", "Ruby", "Scala", "R", "MATLAB", "Perl"
            ],
            "web_frontend": [
                "React", "Vue.js", "Angular", "HTML", "CSS", "SASS", "LESS", "Bootstrap",
                "Tailwind CSS", "jQuery", "Webpack", "Vite", "Next.js", "Nuxt.js"
            ],
            "web_backend": [
                "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET",
                "Laravel", "Ruby on Rails", "Gin", "Echo"
            ],
            "databases": [
                "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "SQLite",
                "Oracle", "SQL Server", "Cassandra", "DynamoDB"
            ],
            "cloud": [
                "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform",
                "Jenkins", "GitLab CI", "GitHub Actions", "Heroku", "Vercel"
            ],
            "data_science": [
                "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas",
                "NumPy", "Scikit-learn", "Jupyter", "Data Analysis", "Statistics"
            ],
            "soft_skills": [
                "Leadership", "Communication", "Problem Solving", "Team Work", "Project Management",
                "Agile", "Scrum", "Critical Thinking", "Creativity", "Adaptability"
            ]
        }
        
        self.education_levels = {
            "phd": ["phd", "ph.d", "doctorate", "doctoral"],
            "masters": ["master", "msc", "m.sc", "ma", "m.a", "mba", "m.b.a"],
            "bachelors": ["bachelor", "bsc", "b.sc", "ba", "b.a", "be", "b.e", "btech", "b.tech"],
            "diploma": ["diploma", "certificate", "associate"]
        }
    
    def extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information from CV text"""
        contact_info = {
            "email": "",
            "phone": "",
            "linkedin": "",
            "github": ""
        }
        
        # Email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info["email"] = emails[0]
        
        # Phone extraction
        phone_patterns = [
            r'[\+]?[1-9]?[0-9]{7,15}',
            r'$$\d{3}$$\s*\d{3}-\d{4}',
            r'\d{3}-\d{3}-\d{4}',
            r'\d{3}\.\d{3}\.\d{4}'
        ]
        
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                contact_info["phone"] = phones[0]
                break
        
        # LinkedIn extraction
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin_matches = re.findall(linkedin_pattern, text.lower())
        if linkedin_matches:
            contact_info["linkedin"] = f"https://{linkedin_matches[0]}"
        
        # GitHub extraction
        github_pattern = r'github\.com/[\w-]+'
        github_matches = re.findall(github_pattern, text.lower())
        if github_matches:
            contact_info["github"] = f"https://{github_matches[0]}"
        
        return contact_info
    
    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract skills categorized by type"""
        text_upper = text.upper()
        found_skills = {category: [] for category in self.skill_keywords}
        
        for category, skills in self.skill_keywords.items():
            for skill in skills:
                if skill.upper() in text_upper:
                    found_skills[category].append(skill)
        
        # Remove empty categories
        return {k: v for k, v in found_skills.items() if v}
    
    def extract_experience(self, text: str) -> Dict[str, Any]:
        """Extract work experience information"""
        experience_info = {
            "total_years": 0,
            "positions": [],
            "companies": []
        }
        
        # Extract years of experience
        exp_patterns = [
            r'(\d+)[\+]?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)',
            r'(\d+)[\+]?\s*(?:year|yr)\s*(?:of\s*)?(?:experience|exp)',
        ]
        
        years = []
        for pattern in exp_patterns:
            matches = re.findall(pattern, text.lower())
            years.extend([int(match) for match in matches])
        
        if years:
            experience_info["total_years"] = max(years)
        
        # Extract job titles and companies (simplified)
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            # Look for patterns like "Software Engineer at Google"
            if ' at ' in line.lower() and len(line) < 100:
                parts = line.split(' at ')
                if len(parts) == 2:
                    position = parts[0].strip()
                    company = parts[1].strip()
                    experience_info["positions"].append(position)
                    experience_info["companies"].append(company)
        
        return experience_info
    
    def extract_education(self, text: str) -> Dict[str, Any]:
        """Extract education information"""
        education_info = {
            "level": "",
            "degree": "",
            "institution": "",
            "year": ""
        }
        
        text_lower = text.lower()
        
        # Determine education level
        for level, keywords in self.education_levels.items():
            for keyword in keywords:
                if keyword in text_lower:
                    education_info["level"] = level
                    break
            if education_info["level"]:
                break
        
        # Extract degree and institution (simplified)
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keywords in self.education_levels.values() for keyword in keywords):
                education_info["degree"] = line.strip()
                break
        
        # Extract graduation year
        year_pattern = r'(19|20)\d{2}'
        years = re.findall(year_pattern, text)
        if years:
            education_info["year"] = max(years)
        
        return education_info
    
    def extract_name(self, text: str) -> str:
        """Extract candidate name from CV"""
        if nlp:
            doc = nlp(text[:500])  # Process first 500 characters
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    return ent.text
        
        # Fallback: look for name in first few lines
        lines = text.split('\n')
        for line in lines[:5]:
            line = line.strip()
            if (len(line) > 2 and len(line) < 50 and 
                ' ' in line and not '@' in line and 
                not any(char.isdigit() for char in line)):
                return line
        
        return "Unknown"
    
    def parse_cv(self, text: str) -> Dict[str, Any]:
        """Main parsing function that combines all extraction methods"""
        parsed_data = {
            "name": self.extract_name(text),
            "contact": self.extract_contact_info(text),
            "skills": self.extract_skills(text),
            "experience": self.extract_experience(text),
            "education": self.extract_education(text),
            "raw_text_length": len(text),
            "parsed_at": datetime.utcnow().isoformat()
        }
        
        return parsed_data

# Scoring algorithm
class CandidateScorer:
    def __init__(self):
        self.skill_weights = {
            "programming": 1.0,
            "web_frontend": 0.9,
            "web_backend": 0.9,
            "databases": 0.8,
            "cloud": 0.7,
            "data_science": 0.8,
            "soft_skills": 0.6
        }
    
    def calculate_skills_score(self, candidate_skills: Dict[str, List[str]], 
                             job_requirements: List[Dict[str, Any]]) -> float:
        """Calculate skills match score"""
        if not job_requirements:
            return 0.0
        
        total_score = 0
        max_possible_score = 0
        
        # Flatten candidate skills
        all_candidate_skills = []
        for category, skills in candidate_skills.items():
            all_candidate_skills.extend([skill.lower() for skill in skills])
        
        for req in job_requirements:
            if req.get("category") == "skill":
                max_possible_score += req.get("weight", 50)
                
                if req["skill"].lower() in all_candidate_skills:
                    total_score += req.get("weight", 50)
        
        return (total_score / max_possible_score * 100) if max_possible_score > 0 else 0
    
    def calculate_experience_score(self, candidate_experience: Dict[str, Any]) -> float:
        """Calculate experience score"""
        years = candidate_experience.get("total_years", 0)
        
        if years == 0:
            return 30  # Base score for no specified experience
        elif years <= 2:
            return 50
        elif years <= 5:
            return 75
        elif years <= 10:
            return 90
        else:
            return 100  # 10+ years experience
    
    def calculate_education_score(self, candidate_education: Dict[str, Any]) -> float:
        """Calculate education score"""
        level = candidate_education.get("level", "").lower()
        
        score_mapping = {
            "phd": 100,
            "masters": 85,
            "bachelors": 70,
            "diploma": 55
        }
        
        return score_mapping.get(level, 40)  # Default score for unspecified education
    
    def calculate_overall_score(self, candidate_data: Dict[str, Any], 
                              job_requirements: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate comprehensive candidate score"""
        skills_score = self.calculate_skills_score(
            candidate_data.get("skills", {}), 
            job_requirements
        )
        
        experience_score = self.calculate_experience_score(
            candidate_data.get("experience", {})
        )
        
        education_score = self.calculate_education_score(
            candidate_data.get("education", {})
        )
        
        # Weighted overall score
        overall_score = (
            skills_score * 0.5 +
            experience_score * 0.3 +
            education_score * 0.2
        )
        
        return {
            "overall_score": round(overall_score, 1),
            "skills_score": round(skills_score, 1),
            "experience_score": round(experience_score, 1),
            "education_score": round(education_score, 1)
        }

# Usage example
if __name__ == "__main__":
    parser = AdvancedCVParser()
    scorer = CandidateScorer()
    
    # Example CV text
    sample_cv = """
    John Doe
    Software Engineer
    john.doe@email.com
    +1-555-123-4567
    
    EXPERIENCE
    Senior Software Engineer at Google (2020-2023)
    - Developed React applications with TypeScript
    - Led team of 5 developers
    - 5 years of experience in web development
    
    EDUCATION
    Bachelor of Science in Computer Science
    Stanford University (2018)
    
    SKILLS
    - Python, JavaScript, React, Node.js
    - AWS, Docker, Kubernetes
    - Machine Learning, TensorFlow
    """
    
    # Parse CV
    parsed_data = parser.parse_cv(sample_cv)
    print("Parsed CV Data:")
    print(json.dumps(parsed_data, indent=2))
    
    # Example job requirements
    job_reqs = [
        {"skill": "React", "weight": 90, "category": "skill"},
        {"skill": "Python", "weight": 80, "category": "skill"},
        {"skill": "AWS", "weight": 70, "category": "skill"}
    ]
    
    # Calculate scores
    scores = scorer.calculate_overall_score(parsed_data, job_reqs)
    print("\nCandidate Scores:")
    print(json.dumps(scores, indent=2))
