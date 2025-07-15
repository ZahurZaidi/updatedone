#!/usr/bin/env python3
"""
Backend Test for AI-Powered Skin Care Assessment Application

This test suite validates the Supabase integration and API functionality
for the skin care assessment application.
"""

import requests
import json
import sys
import time
from datetime import datetime
import os

class SupabaseAPITester:
    def __init__(self, app_url="https://care-canvas.netlify.app"):
        self.app_url = app_url
        self.supabase_url = "https://vnfdetnvevlykyufppgx.supabase.co"
        self.supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZmRldG52ZXZseWt5dWZwcGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzOTk0MTYsImV4cCI6MjA2NTk3NTQxNn0.ncWM1LJ1vNMiD5tzwug3YKeaZSK1L9XTVWWi2_SDb_0"
        self.gemini_api_key = "AIzaSyBBJWvVK4k8F5K5Bd_oHTn5Yjp1pEsmeHs"
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        
        # Headers for Supabase API calls
        self.headers = {
            'apikey': self.supabase_anon_key,
            'Authorization': f'Bearer {self.supabase_anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        if details:
            print(f"   Details: {details}")

    def test_app_accessibility(self):
        """Test if the main application is accessible"""
        try:
            response = requests.get(self.app_url, timeout=10)
            success = response.status_code == 200
            self.log_test("App Accessibility", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("App Accessibility", False, str(e))
            return False

    def test_supabase_connection(self):
        """Test Supabase API connection"""
        try:
            url = f"{self.supabase_url}/rest/v1/"
            response = requests.get(url, headers=self.headers, timeout=10)
            success = response.status_code in [200, 404]  # 404 is expected for root endpoint
            self.log_test("Supabase Connection", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Supabase Connection", False, str(e))
            return False

    def test_gemini_api_connection(self):
        """Test Gemini API connection"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.gemini_api_key}"
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": "Test connection. Respond with 'OK'."
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 50
                }
            }
            
            response = requests.post(url, json=payload, timeout=15)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    response_text = data['candidates'][0]['content']['parts'][0]['text']
                    self.log_test("Gemini API Connection", True, f"Response: {response_text[:50]}")
                else:
                    self.log_test("Gemini API Connection", False, "Invalid response structure")
                    success = False
            else:
                self.log_test("Gemini API Connection", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_test("Gemini API Connection", False, str(e))
            return False

    def test_user_registration(self):
        """Test user registration functionality"""
        try:
            # Generate unique test user
            timestamp = int(time.time())
            test_email = f"test_user_{timestamp}@example.com"
            test_password = "TestPassword123!"
            
            url = f"{self.supabase_url}/auth/v1/signup"
            payload = {
                "email": test_email,
                "password": test_password,
                "data": {
                    "name": f"Test User {timestamp}"
                }
            }
            
            response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'user' in data and data['user']:
                    self.user_id = data['user']['id']
                    if 'session' in data and data['session']:
                        self.session_token = data['session']['access_token']
                        # Update headers with session token
                        self.headers['Authorization'] = f'Bearer {self.session_token}'
                    
                    self.log_test("User Registration", True, f"User ID: {self.user_id}")
                    return True
                else:
                    self.log_test("User Registration", False, "No user data in response")
                    return False
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, str(e))
            return False

    def test_user_profile_creation(self):
        """Test user profile creation in database"""
        if not self.user_id:
            self.log_test("User Profile Creation", False, "No user ID available")
            return False
            
        try:
            url = f"{self.supabase_url}/rest/v1/user_profiles"
            payload = {
                "user_id": self.user_id,
                "daily_water_intake": "7-9 glasses",
                "sun_exposure": "30 minutes to 1 hour",
                "current_skincare_steps": "3-4 steps (includes serum or toner)",
                "comfortable_routine_length": "3-4 steps",
                "known_allergies": "None",
                "side_effects_ingredients": "Never",
                "skin_type": "Normal",
                "hydration_level": "Good"
            }
            
            response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            success = response.status_code in [200, 201]
            
            if success:
                self.log_test("User Profile Creation", True, "Profile created successfully")
            else:
                self.log_test("User Profile Creation", False, f"Status: {response.status_code}, Response: {response.text}")
            
            return success
            
        except Exception as e:
            self.log_test("User Profile Creation", False, str(e))
            return False

    def test_skin_assessment_creation(self):
        """Test skin assessment creation"""
        if not self.user_id:
            self.log_test("Skin Assessment Creation", False, "No user ID available")
            return False
            
        try:
            url = f"{self.supabase_url}/rest/v1/skin_assessments"
            payload = {
                "user_id": self.user_id,
                "skin_type": "Normal",
                "hydration_level": "Good",
                "assessment_answers": {
                    "skin_answers": [
                        "Comfortable all day",
                        "Noticeable",
                        "Soft and comfortable",
                        "Occasionally",
                        "Rarely irritated",
                        "Quickly",
                        "Smooth"
                    ],
                    "lifestyle_answers": {
                        "sun_exposure": "30 minutes to 1 hour",
                        "daily_water_intake": "7-9 glasses",
                        "sleep_pattern": "7-8 hours",
                        "work_hours": "7-9 hours",
                        "current_skincare_steps": "3-4 steps (includes serum or toner)",
                        "comfortable_routine_length": "3-4 steps",
                        "food_preference": "Vegetarian",
                        "meal_type": "Home-cooked and wholesome",
                        "known_allergies": "None",
                        "side_effects_ingredients": "Never"
                    }
                }
            }
            
            response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            success = response.status_code in [200, 201]
            
            if success:
                self.log_test("Skin Assessment Creation", True, "Assessment created successfully")
            else:
                self.log_test("Skin Assessment Creation", False, f"Status: {response.status_code}, Response: {response.text}")
            
            return success
            
        except Exception as e:
            self.log_test("Skin Assessment Creation", False, str(e))
            return False

    def test_data_retrieval(self):
        """Test data retrieval from database"""
        if not self.user_id:
            self.log_test("Data Retrieval", False, "No user ID available")
            return False
            
        try:
            # Test user profile retrieval
            url = f"{self.supabase_url}/rest/v1/user_profiles?user_id=eq.{self.user_id}"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    profile = data[0]
                    has_lifestyle_data = all(key in profile for key in [
                        'daily_water_intake', 'sun_exposure', 'current_skincare_steps',
                        'comfortable_routine_length', 'skin_type', 'hydration_level'
                    ])
                    
                    if has_lifestyle_data:
                        self.log_test("Data Retrieval", True, "Profile data retrieved with lifestyle fields")
                        return True
                    else:
                        self.log_test("Data Retrieval", False, "Missing lifestyle data fields")
                        return False
                else:
                    self.log_test("Data Retrieval", False, "No profile data found")
                    return False
            else:
                self.log_test("Data Retrieval", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Data Retrieval", False, str(e))
            return False

    def test_gemini_skin_analysis(self):
        """Test Gemini API skin type analysis"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.gemini_api_key}"
            
            # Sample assessment data
            skin_answers = [
                "Comfortable all day",
                "Noticeable", 
                "Soft and comfortable",
                "Occasionally",
                "Rarely irritated",
                "Quickly",
                "Smooth"
            ]
            
            lifestyle_answers = {
                "daily_water_intake": "7-9 glasses",
                "sun_exposure": "30 minutes to 1 hour",
                "current_skincare_steps": "3-4 steps"
            }
            
            prompt = f"""You are a certified dermatologist. Analyze this skin assessment:

Skin Assessment: {', '.join(skin_answers)}
Lifestyle: {json.dumps(lifestyle_answers)}

Provide analysis in JSON format:
{{
  "skin_type": "Normal/Dry/Oily/Combination/Sensitive",
  "hydration_level": "Low/Medium/Good/High"
}}"""
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 200
                }
            }
            
            response = requests.post(url, json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    response_text = data['candidates'][0]['content']['parts'][0]['text']
                    
                    # Try to parse JSON from response
                    try:
                        # Extract JSON from response
                        import re
                        json_match = re.search(r'\{[^}]*\}', response_text)
                        if json_match:
                            analysis = json.loads(json_match.group())
                            if 'skin_type' in analysis and 'hydration_level' in analysis:
                                self.log_test("Gemini Skin Analysis", True, f"Analysis: {analysis}")
                                return True
                            else:
                                self.log_test("Gemini Skin Analysis", False, "Missing required fields in analysis")
                                return False
                        else:
                            self.log_test("Gemini Skin Analysis", False, "No JSON found in response")
                            return False
                    except json.JSONDecodeError:
                        self.log_test("Gemini Skin Analysis", False, "Invalid JSON in response")
                        return False
                else:
                    self.log_test("Gemini Skin Analysis", False, "No candidates in response")
                    return False
            else:
                self.log_test("Gemini Skin Analysis", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Gemini Skin Analysis", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting Backend API Tests for AI-Powered Skin Care Assessment")
        print("=" * 70)
        
        # Test basic connectivity
        print("\n📡 Testing Connectivity...")
        self.test_app_accessibility()
        self.test_supabase_connection()
        self.test_gemini_api_connection()
        
        # Test user management
        print("\n👤 Testing User Management...")
        if self.test_user_registration():
            self.test_user_profile_creation()
            self.test_skin_assessment_creation()
            self.test_data_retrieval()
        
        # Test AI integration
        print("\n🤖 Testing AI Integration...")
        self.test_gemini_skin_analysis()
        
        # Print summary
        print("\n" + "=" * 70)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! Backend is working correctly.")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed. Check the issues above.")
            return 1

def main():
    """Main test execution"""
    tester = SupabaseAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())