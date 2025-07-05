"""
Test script for the recruitment API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_login():
    """Test user login"""
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@recruitment.com",
        "password": "admin123"
    })
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Login successful")
        print(f"Token: {data['access_token'][:50]}...")
        return data['access_token']
    else:
        print("❌ Login failed")
        print(response.text)
        return None

def test_dashboard_stats(token):
    """Test dashboard statistics"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Dashboard stats retrieved")
        print(f"Total candidates: {data['total_candidates']}")
        print(f"Active jobs: {data['active_jobs']}")
        print(f"Average score: {data['average_score']}%")
    else:
        print("❌ Dashboard stats failed")
        print(response.text)

def test_candidates(token):
    """Test candidates endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/candidates", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Retrieved {len(data)} candidates")
        if data:
            print(f"Top candidate: {data[0]['name']} ({data[0]['overall_score']:.1f}%)")
    else:
        print("❌ Candidates retrieval failed")
        print(response.text)

def test_job_positions(token):
    """Test job positions endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/job-positions", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Retrieved {len(data)} job positions")
        if data:
            print(f"First job: {data[0]['title']} in {data[0]['department']}")
    else:
        print("❌ Job positions retrieval failed")
        print(response.text)

def test_ai_chat(token):
    """Test AI chatbot"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/ai/chat", 
                           params={"message": "Show me top candidates"},
                           headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ AI Chat working")
        print(f"Response: {data['response'][:100]}...")
    else:
        print("❌ AI Chat failed")
        print(response.text)

def main():
    print("🚀 Testing Recruitment API")
    print("=" * 50)
    
    # Test login
    token = test_login()
    if not token:
        return
    
    print("\n" + "=" * 50)
    
    # Test other endpoints
    test_dashboard_stats(token)
    print()
    test_candidates(token)
    print()
    test_job_positions(token)
    print()
    test_ai_chat(token)
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")

if __name__ == "__main__":
    main()
