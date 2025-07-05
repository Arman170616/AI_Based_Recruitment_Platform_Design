"""
Calendar integration for Google Calendar and Outlook
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class CalendarIntegration:
    def __init__(self):
        self.google_credentials = None
        self.outlook_credentials = None
    
    def setup_google_calendar(self, credentials_file: str):
        """Setup Google Calendar integration"""
        try:
            flow = Flow.from_client_secrets_file(
                credentials_file,
                scopes=['https://www.googleapis.com/auth/calendar']
            )
            flow.redirect_uri = 'http://localhost:8080/callback'
            
            # This would typically be handled in a web flow
            auth_url, _ = flow.authorization_url(prompt='consent')
            print(f"Please visit this URL to authorize the application: {auth_url}")
            
            return True
        except Exception as e:
            print(f"Error setting up Google Calendar: {e}")
            return False
    
    def create_google_calendar_event(self, event_data: Dict[str, Any]) -> Optional[str]:
        """Create a Google Calendar event"""
        try:
            service = build('calendar', 'v3', credentials=self.google_credentials)
            
            event = {
                'summary': event_data['title'],
                'description': event_data.get('description', ''),
                'start': {
                    'dateTime': event_data['start_time'],
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': event_data['end_time'],
                    'timeZone': 'UTC',
                },
                'attendees': [
                    {'email': email} for email in event_data.get('attendees', [])
                ],
                'conferenceData': {
                    'createRequest': {
                        'requestId': f"interview-{datetime.now().timestamp()}",
                        'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                    }
                } if event_data.get('create_meet_link') else None
            }
            
            created_event = service.events().insert(
                calendarId='primary',
                body=event,
                conferenceDataVersion=1 if event_data.get('create_meet_link') else 0
            ).execute()
            
            return created_event.get('id')
            
        except Exception as e:
            print(f"Error creating Google Calendar event: {e}")
            return None
    
    def create_interview_event(self, candidate_name: str, interviewer_email: str,
                             candidate_email: str, start_time: datetime,
                             duration_minutes: int = 60, position: str = "") -> Optional[str]:
        """Create an interview calendar event"""
        
        end_time = start_time + timedelta(minutes=duration_minutes)
        
        event_data = {
            'title': f'Interview: {candidate_name} - {position}',
            'description': f'Interview with {candidate_name} for the position of {position}',
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat(),
            'attendees': [interviewer_email, candidate_email],
            'create_meet_link': True
        }
        
        return self.create_google_calendar_event(event_data)

# Usage in main.py - add these endpoints
"""
@app.post("/calendar/create-interview-event")
async def create_interview_calendar_event(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    candidate = db.query(Candidate).filter(Candidate.id == interview.candidate_id).first()
    interviewer = db.query(User).filter(User.id == interview.interviewer_id).first()
    job_position = db.query(JobPosition).filter(JobPosition.id == candidate.job_position_id).first()
    
    calendar_service = CalendarIntegration()
    
    event_id = calendar_service.create_interview_event(
        candidate_name=candidate.name,
        interviewer_email=interviewer.email,
        candidate_email=candidate.email,
        start_time=interview.scheduled_date,
        duration_minutes=interview.duration,
        position=job_position.title if job_position else ""
    )
    
    if event_id:
        return {"message": "Calendar event created successfully", "event_id": event_id}
    else:
        raise HTTPException(status_code=500, detail="Failed to create calendar event")
"""
