import requests
import sys
import json
from datetime import datetime

class NonProfitPortalTester:
    def __init__(self, base_url="http://127.0.0.1:8000"): 
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if self.admin_token and 'Authorization' not in headers:
            headers['Authorization'] = f'Bearer {self.admin_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                self.failed_tests.append(f"{name} - Expected {expected_status}, got {response.status_code}")
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            self.failed_tests.append(f"{name} - Error: {str(e)}")
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "api/", 200)

    def test_registration_count(self):
        """Test registration count endpoint"""
        success, response = self.run_test("Registration Count", "GET", "api/registrations/count", 200)
        if success:
            required_fields = ['students', 'volunteers', 'students_limit_reached', 'volunteers_limit_reached']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            print(f"   Current counts - Students: {response.get('students', 0)}, Volunteers: {response.get('volunteers', 0)}")
        return success

    def test_student_registration(self):
        """Test student registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        student_data = {
            "name": f"Test Student {timestamp}",
            "age_grade": "Grade 8",
            "school": "Test School",
            "email": f"student{timestamp}@test.com",
            "phone": "1234567890",
            "consent": True
        }
        return self.run_test("Student Registration", "POST", "api/students/register", 200, student_data)

    def test_student_registration_no_consent(self):
        """Test student registration without consent"""
        timestamp = datetime.now().strftime('%H%M%S')
        student_data = {
            "name": f"Test Student No Consent {timestamp}",
            "age_grade": "Grade 8",
            "school": "Test School",
            "email": f"noconsent{timestamp}@test.com",
            "phone": "1234567890",
            "consent": False
        }
        return self.run_test("Student Registration (No Consent)", "POST", "api/students/register", 400, student_data)

    def test_volunteer_registration(self):
        """Test volunteer registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        volunteer_data = {
            "name": f"Test Volunteer {timestamp}",
            "email": f"volunteer{timestamp}@test.com",
            "phone": "1234567890",
            "organization": "Test Organization"
        }
        return self.run_test("Volunteer Registration", "POST", "api/volunteers/register", 200, volunteer_data)

    def test_contact_form(self):
        """Test contact form submission"""
        timestamp = datetime.now().strftime('%H%M%S')
        contact_data = {
            "name": f"Test Contact {timestamp}",
            "email": f"contact{timestamp}@test.com",
            "message": "This is a test message from the automated test suite."
        }
        return self.run_test("Contact Form", "POST", "api/contact", 200, contact_data)

    def test_admin_login_correct(self):
        """Test admin login with correct password"""
        login_data = {"password": "admin123"}
        success, response = self.run_test("Admin Login (Correct)", "POST", "api/admin/login", 200, login_data)
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   Admin token obtained: {self.admin_token[:20]}...")
        return success

    def test_admin_login_incorrect(self):
        """Test admin login with incorrect password"""
        login_data = {"password": "wrongpassword"}
        return self.run_test("Admin Login (Incorrect)", "POST", "api/admin/login", 401, login_data)

    def test_get_event_content(self):
        """Test getting event content"""
        return self.run_test("Get Event Content", "GET", "api/admin/event", 200)

    def test_update_event_content(self):
        """Test updating event content"""
        if not self.admin_token:
            print("❌ Cannot test event update - no admin token")
            return False
            
        timestamp = datetime.now().strftime('%H:%M:%S')
        event_data = {
            "title": f"Updated Spell-Bee Competition {timestamp}",
            "description": "Updated description for testing purposes",
            "date": "April 20, 2025",
            "location": "Updated Test Location"
        }
        return self.run_test("Update Event Content", "PUT", "api/admin/event", 200, event_data)

def main():
    print("🚀 Starting Non-Profit Competition Portal API Tests")
    print("=" * 60)
    
    tester = NonProfitPortalTester()
    
    # Test basic endpoints
    tester.test_api_root()
    tester.test_registration_count()
    
    # Test registrations
    tester.test_student_registration()
    tester.test_student_registration_no_consent()
    tester.test_volunteer_registration()
    tester.test_contact_form()
    
    # Test admin functionality
    tester.test_admin_login_correct()
    tester.test_admin_login_incorrect()
    tester.test_get_event_content()
    tester.test_update_event_content()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed_test in tester.failed_tests:
            print(f"   - {failed_test}")
    else:
        print("\n✅ All tests passed!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
import requests
import sys
import json
from datetime import datetime

class NonProfitPortalTester:
    def __init__(self, base_url="http://127.0.0.1:8000"): 
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if self.admin_token and 'Authorization' not in headers:
            headers['Authorization'] = f'Bearer {self.admin_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                self.failed_tests.append(f"{name} - Expected {expected_status}, got {response.status_code}")
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            self.failed_tests.append(f"{name} - Error: {str(e)}")
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "api/", 200)

    def test_registration_count(self):
        """Test registration count endpoint"""
        success, response = self.run_test("Registration Count", "GET", "api/registrations/count", 200)
        if success:
            required_fields = ['students', 'volunteers', 'students_limit_reached', 'volunteers_limit_reached']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            print(f"   Current counts - Students: {response.get('students', 0)}, Volunteers: {response.get('volunteers', 0)}")
        return success

    def test_student_registration(self):
        """Test student registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        student_data = {
            "name": f"Test Student {timestamp}",
            "age_grade": "Grade 8",
            "school": "Test School",
            "email": f"student{timestamp}@test.com",
            "phone": "1234567890",
            "consent": True
        }
        return self.run_test("Student Registration", "POST", "api/students/register", 200, student_data)

    def test_student_registration_no_consent(self):
        """Test student registration without consent"""
        timestamp = datetime.now().strftime('%H%M%S')
        student_data = {
            "name": f"Test Student No Consent {timestamp}",
            "age_grade": "Grade 8",
            "school": "Test School",
            "email": f"noconsent{timestamp}@test.com",
            "phone": "1234567890",
            "consent": False
        }
        return self.run_test("Student Registration (No Consent)", "POST", "api/students/register", 400, student_data)

    def test_volunteer_registration(self):
        """Test volunteer registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        volunteer_data = {
            "name": f"Test Volunteer {timestamp}",
            "email": f"volunteer{timestamp}@test.com",
            "phone": "1234567890",
            "organization": "Test Organization"
        }
        return self.run_test("Volunteer Registration", "POST", "api/volunteers/register", 200, volunteer_data)

    def test_contact_form(self):
        """Test contact form submission"""
        timestamp = datetime.now().strftime('%H%M%S')
        contact_data = {
            "name": f"Test Contact {timestamp}",
            "email": f"contact{timestamp}@test.com",
            "message": "This is a test message from the automated test suite."
        }
        return self.run_test("Contact Form", "POST", "api/contact", 200, contact_data)

    def test_admin_login_correct(self):
        """Test admin login with correct password"""
        login_data = {"password": "admin123"}
        success, response = self.run_test("Admin Login (Correct)", "POST", "api/admin/login", 200, login_data)
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   Admin token obtained: {self.admin_token[:20]}...")
        return success

    def test_admin_login_incorrect(self):
        """Test admin login with incorrect password"""
        login_data = {"password": "wrongpassword"}
        return self.run_test("Admin Login (Incorrect)", "POST", "api/admin/login", 401, login_data)

    def test_get_event_content(self):
        """Test getting event content"""
        return self.run_test("Get Event Content", "GET", "api/admin/event", 200)

    def test_update_event_content(self):
        """Test updating event content"""
        if not self.admin_token:
            print("❌ Cannot test event update - no admin token")
            return False
            
        timestamp = datetime.now().strftime('%H:%M:%S')
        event_data = {
            "title": f"Updated Spell-Bee Competition {timestamp}",
            "description": "Updated description for testing purposes",
            "date": "April 20, 2025",
            "location": "Updated Test Location"
        }
        return self.run_test("Update Event Content", "PUT", "api/admin/event", 200, event_data)

def main():
    print("🚀 Starting Non-Profit Competition Portal API Tests")
    print("=" * 60)
    
    tester = NonProfitPortalTester()
    
    # Test basic endpoints
    tester.test_api_root()
    tester.test_registration_count()
    
    # Test registrations
    tester.test_student_registration()
    tester.test_student_registration_no_consent()
    tester.test_volunteer_registration()
    tester.test_contact_form()
    
    # Test admin functionality
    tester.test_admin_login_correct()
    tester.test_admin_login_incorrect()
    tester.test_get_event_content()
    tester.test_update_event_content()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed_test in tester.failed_tests:
            print(f"   - {failed_test}")
    else:
        print("\n✅ All tests passed!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())