# Issue: Authentication Implementation

**Milestone:** 2 - Authentication & User Management

**Labels:** `auth`, `security`, `backend`

**Checklist:**
- [ ] Implement user registration endpoint
- [ ] Implement user login endpoint with JWT
- [ ] Hash passwords using bcrypt
- [ ] Create role-based permission middleware
- [ ] Implement password reset functionality
- [ ] Create user profile management

**Description:**
Implement complete user authentication and authorization system supporting three roles: Customer, Support Agent, and Admin. System must issue JWT tokens on login and enforce role-based access control throughout the application.

**Expected Result:**
- Users can register with username/email and password
- Users can login and receive JWT token
- Passwords are hashed using bcrypt
- API endpoints protected by role middleware
- Three distinct roles with proper permissions
- Password reset flow via email or token