"""
Email service for sending notifications and reminders
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MimeBase
from email import encoders
import os
from typing import List, Optional
from jinja2 import Template

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.email = os.getenv("EMAIL_USER", "")
        self.password = os.getenv("EMAIL_PASSWORD", "")
    
    def send_email(self, to_emails: List[str], subject: str, 
                   html_content: str, text_content: str = None,
                   attachments: List[str] = None) -> bool:
        """Send email with optional attachments"""
        try:
            msg = MIMEMultipart('alternative')
            msg['From'] = self.email
            msg['To'] = ', '.join(to_emails)
            msg['Subject'] = subject
            
            # Add text content
            if text_content:
                msg.attach(MIMEText(text_content, 'plain'))
            
            # Add HTML content
            msg.attach(MIMEText(html_content, 'html'))
            
            # Add attachments
            if attachments:
                for file_path in attachments:
                    if os.path.exists(file_path):
                        with open(file_path, "rb") as attachment:
                            part = MimeBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                            encoders.encode_base64(part)
                            part.add_header(
                                'Content-Disposition',
                                f'attachment; filename= {os.path.basename(file_path)}'
                            )
                            msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            server.send_message(msg)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    def send_interview_invitation(self, candidate_email: str, candidate_name: str,
                                position: str, interview_date: str, interview_time: str,
                                interview_type: str, meeting_link: str = None) -> bool:
        """Send interview invitation email"""
        
        template = Template("""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">Interview Invitation</h2>
                
                <p>Dear {{ candidate_name }},</p>
                
                <p>We are pleased to invite you for an interview for the position of <strong>{{ position }}</strong>.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #495057;">Interview Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Date:</strong> {{ interview_date }}</li>
                        <li><strong>Time:</strong> {{ interview_time }}</li>
                        <li><strong>Type:</strong> {{ interview_type }}</li>
                        {% if meeting_link %}
                        <li><strong>Meeting Link:</strong> <a href="{{ meeting_link }}">{{ meeting_link }}</a></li>
                        {% endif %}
                    </ul>
                </div>
                
                <p>Please confirm your attendance by replying to this email.</p>
                
                <p>We look forward to speaking with you!</p>
                
                <p>Best regards,<br>
                The Recruitment Team</p>
            </div>
        </body>
        </html>
        """)
        
        html_content = template.render(
            candidate_name=candidate_name,
            position=position,
            interview_date=interview_date,
            interview_time=interview_time,
            interview_type=interview_type,
            meeting_link=meeting_link
        )
        
        subject = f"Interview Invitation - {position}"
        
        return self.send_email([candidate_email], subject, html_content)
    
    def send_status_update(self, candidate_email: str, candidate_name: str,
                          position: str, status: str, message: str = None) -> bool:
        """Send candidate status update email"""
        
        status_messages = {
            "shortlisted": "Congratulations! You have been shortlisted for the next round.",
            "rejected": "Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.",
            "interviewed": "Thank you for taking the time to interview with us. We will be in touch soon with next steps."
        }
        
        default_message = status_messages.get(status, "Your application status has been updated.")
        final_message = message or default_message
        
        template = Template("""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">Application Status Update</h2>
                
                <p>Dear {{ candidate_name }},</p>
                
                <p>We wanted to update you on the status of your application for the position of <strong>{{ position }}</strong>.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Status:</strong> {{ status|title }}</p>
                    <p>{{ message }}</p>
                </div>
                
                <p>Thank you for your continued interest in our company.</p>
                
                <p>Best regards,<br>
                The Recruitment Team</p>
            </div>
        </body>
        </html>
        """)
        
        html_content = template.render(
            candidate_name=candidate_name,
            position=position,
            status=status,
            message=final_message
        )
        
        subject = f"Application Status Update - {position}"
        
        return self.send_email([candidate_email], subject, html_content)
