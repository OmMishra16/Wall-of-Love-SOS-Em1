#!/usr/bin/env python3
"""
Wall of Love Backend API Test Suite
Comprehensive testing for authentication, CRUD operations, file uploads, and access control
"""

import requests
import json
import os
import tempfile
from PIL import Image
import io

# Configuration
BASE_URL = "http://localhost:8001/api"
TEST_USER_EMAIL = "testuser2@example.com"
TEST_USER_PASSWORD = "password123"
TEST_USER_NAME = "Test User 2"
EXISTING_USER_EMAIL = "test@example.com"
EXISTING_USER_PASSWORD = "password123"

class WallOfLoveAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        self.created_items = []
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def create_test_image(self):
        """Create a test image file"""
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        return img_bytes
    
    def test_health_check(self):
        """Test health endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, "Backend is healthy")
                    return True
                else:
                    self.log_result("Health Check", False, f"Unexpected health status: {data}")
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_user_registration(self):
        """Test user registration"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
                "name": TEST_USER_NAME
            }
            response = self.session.post(f"{BASE_URL}/auth/register", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.log_result("User Registration", True, f"Successfully registered user: {data['user']['email']}")
                    return True
                else:
                    self.log_result("User Registration", False, f"Missing token or user data: {data}")
            elif response.status_code == 400:
                # User might already exist, try to continue with login
                self.log_result("User Registration", True, "User already exists (expected for repeated tests)")
                return True
            else:
                self.log_result("User Registration", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("User Registration", False, f"Error: {str(e)}")
        return False
    
    def test_user_login_valid(self):
        """Test login with valid credentials"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            response = self.session.post(f"{BASE_URL}/auth/login", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.log_result("Valid Login", True, f"Successfully logged in: {data['user']['email']}")
                    return True
                else:
                    self.log_result("Valid Login", False, f"Missing token or user data: {data}")
            else:
                self.log_result("Valid Login", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Valid Login", False, f"Error: {str(e)}")
        return False
    
    def test_user_login_invalid(self):
        """Test login with invalid credentials"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": "wrongpassword"
            }
            response = self.session.post(f"{BASE_URL}/auth/login", json=payload)
            
            if response.status_code == 401:
                self.log_result("Invalid Login", True, "Correctly rejected invalid credentials")
                return True
            else:
                self.log_result("Invalid Login", False, f"Expected 401, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Invalid Login", False, f"Error: {str(e)}")
        return False
    
    def test_protected_endpoint_without_token(self):
        """Test accessing protected endpoint without token"""
        try:
            response = self.session.get(f"{BASE_URL}/auth/me")
            
            if response.status_code == 401:
                self.log_result("Protected Access (No Token)", True, "Correctly rejected request without token")
                return True
            else:
                self.log_result("Protected Access (No Token)", False, f"Expected 401, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Protected Access (No Token)", False, f"Error: {str(e)}")
        return False
    
    def test_protected_endpoint_with_token(self):
        """Test accessing protected endpoint with valid token"""
        if not self.auth_token:
            self.log_result("Protected Access (With Token)", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "email" in data:
                    self.log_result("Protected Access (With Token)", True, f"Successfully accessed protected endpoint: {data['email']}")
                    return True
                else:
                    self.log_result("Protected Access (With Token)", False, f"Missing user data: {data}")
            else:
                self.log_result("Protected Access (With Token)", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Protected Access (With Token)", False, f"Error: {str(e)}")
        return False
    
    def test_public_items_access(self):
        """Test public access to items endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/items")
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Public Items Access", True, f"Successfully accessed public items endpoint, found {len(data)} items")
                return True
            else:
                self.log_result("Public Items Access", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Public Items Access", False, f"Error: {str(e)}")
        return False
    
    def test_create_sticky_note(self, color="yellow", content="Test sticky note"):
        """Test creating a sticky note"""
        if not self.auth_token:
            self.log_result("Create Sticky Note", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            payload = {
                "type": "sticky",
                "content": content,
                "position": {"x": 100, "y": 100, "gridColumn": 1, "gridRow": 1},
                "background_color": color
            }
            response = self.session.post(f"{BASE_URL}/items", json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data:
                    self.created_items.append(data["id"])
                    self.log_result("Create Sticky Note", True, f"Successfully created sticky note with ID: {data['id']}")
                    return data["id"]
                else:
                    self.log_result("Create Sticky Note", False, f"Missing ID in response: {data}")
            else:
                self.log_result("Create Sticky Note", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Create Sticky Note", False, f"Error: {str(e)}")
        return None
    
    def test_update_sticky_note(self, item_id, new_content="Updated sticky note content"):
        """Test updating a sticky note"""
        if not self.auth_token:
            self.log_result("Update Sticky Note", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            payload = {"content": new_content}
            response = self.session.put(f"{BASE_URL}/items/{item_id}", json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("content") == new_content:
                    self.log_result("Update Sticky Note", True, f"Successfully updated sticky note content")
                    return True
                else:
                    self.log_result("Update Sticky Note", False, f"Content not updated correctly: {data}")
            else:
                self.log_result("Update Sticky Note", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Update Sticky Note", False, f"Error: {str(e)}")
        return False
    
    def test_update_sticky_position(self, item_id):
        """Test updating a sticky note position"""
        if not self.auth_token:
            self.log_result("Update Sticky Position", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            new_position = {"x": 200, "y": 200, "gridColumn": 2, "gridRow": 2}
            payload = {"position": new_position}
            response = self.session.put(f"{BASE_URL}/items/{item_id}", json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("position") == new_position:
                    self.log_result("Update Sticky Position", True, f"Successfully updated sticky note position")
                    return True
                else:
                    self.log_result("Update Sticky Position", False, f"Position not updated correctly: {data}")
            else:
                self.log_result("Update Sticky Position", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Update Sticky Position", False, f"Error: {str(e)}")
        return False
    
    def test_file_upload(self):
        """Test file upload functionality"""
        if not self.auth_token:
            self.log_result("File Upload", False, "No auth token available")
            return None
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            # Create test image
            img_bytes = self.create_test_image()
            files = {'file': ('test_image.png', img_bytes, 'image/png')}
            
            response = self.session.post(f"{BASE_URL}/upload", files=files, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "filename" in data and "url" in data:
                    self.log_result("File Upload", True, f"Successfully uploaded file: {data['filename']}")
                    return data
                else:
                    self.log_result("File Upload", False, f"Missing filename or url in response: {data}")
            else:
                self.log_result("File Upload", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("File Upload", False, f"Error: {str(e)}")
        return None
    
    def test_create_image_item(self, image_url):
        """Test creating an image item with uploaded file"""
        if not self.auth_token:
            self.log_result("Create Image Item", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            payload = {
                "type": "image",
                "image_url": image_url,
                "caption": "Test uploaded image",
                "position": {"x": 300, "y": 300, "gridColumn": 3, "gridRow": 3}
            }
            response = self.session.post(f"{BASE_URL}/items", json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data:
                    self.created_items.append(data["id"])
                    self.log_result("Create Image Item", True, f"Successfully created image item with ID: {data['id']}")
                    return data["id"]
                else:
                    self.log_result("Create Image Item", False, f"Missing ID in response: {data}")
            else:
                self.log_result("Create Image Item", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Create Image Item", False, f"Error: {str(e)}")
        return None
    
    def test_delete_item(self, item_id):
        """Test deleting an item"""
        if not self.auth_token:
            self.log_result("Delete Item", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.delete(f"{BASE_URL}/items/{item_id}", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Delete Item", True, f"Successfully deleted item: {item_id}")
                    return True
                else:
                    self.log_result("Delete Item", False, f"Unexpected response: {data}")
            else:
                self.log_result("Delete Item", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Delete Item", False, f"Error: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("\n🧪 Starting Wall of Love Backend API Tests\n")
        
        # Health check first
        if not self.test_health_check():
            print("❌ Backend is not healthy, stopping tests")
            return
        
        # Authentication tests
        print("\n🔐 Authentication Tests")
        self.test_user_registration()
        self.test_user_login_valid()
        self.test_user_login_invalid()
        self.test_protected_endpoint_without_token()
        self.test_protected_endpoint_with_token()
        
        # Public access test
        print("\n🌐 Public Access Tests")
        self.test_public_items_access()
        
        # Wall items tests
        print("\n📝 Wall Items Tests")
        sticky_id1 = self.test_create_sticky_note("yellow", "First test sticky note")
        sticky_id2 = self.test_create_sticky_note("blue", "Second test sticky note")
        sticky_id3 = self.test_create_sticky_note("green", "Third test sticky note")
        
        if sticky_id1:
            self.test_update_sticky_note(sticky_id1, "Updated first sticky note")
            self.test_update_sticky_position(sticky_id1)
        
        # File upload tests
        print("\n📁 File Upload Tests")
        upload_result = self.test_file_upload()
        if upload_result:
            image_id = self.test_create_image_item(upload_result["url"])
        
        # Cleanup - delete created items
        print("\n🧹 Cleanup Tests")
        for item_id in self.created_items:
            self.test_delete_item(item_id)
        
        # Summary
        print("\n📊 Test Summary")
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = WallOfLoveAPITester()
    tester.run_all_tests()