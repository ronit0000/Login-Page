# Login Page - Testing Hackathon Project

## 📋 Project Overview

This is a login page created specifically for a testing hackathon. The page contains **intentional bugs and security vulnerabilities** to demonstrate boundary value testing, functional testing, and security testing practices.

**⚠️ WARNING:** This code contains intentional security vulnerabilities and should NOT be used in production environments.

## 🎯 Purpose

- Demonstrate various types of software testing
- Practice boundary value analysis
- Identify functional bugs
- Explore security vulnerabilities
- Implement comprehensive test cases

## 🚀 Live Demo

GitHub Pages URL: `https://ronit0000.github.io/Login-Page/`

## 📁 Project Structure

```
Login-Page/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript with intentional bugs
└── README.md           # This documentation
```

## 🐛 Intentional Bugs & Vulnerabilities

### 1. **Email Validation Issues** 
**Location:** `script.js` - `validateEmail()` function

**Bug Description:**
- Extremely weak email validation
- Only checks if '@' symbol is present
- Accepts invalid formats like:
  - `test` (no @ symbol check actually fails, but could accept `@`)
  - `test@` (incomplete domain)
  - `@domain.com` (missing username)
  - `test@@domain.com` (multiple @ symbols)
  - `test@domain` (missing TLD)

**Expected Behavior:** Should validate proper email format: `username@domain.tld`

**Test Cases:**
- ✅ Valid: `user@example.com`
- ❌ Should Reject: `test`, `test@`, `@domain.com`, `user@domain`, `user@@example.com`

---

### 2. **Missing Boundary Checks**
**Location:** `script.js` - `validatePassword()` function

**Bug Description:**
- No minimum or maximum length validation
- Accepts passwords of ANY length (even 1 character or 0 characters)
- No complexity requirements (uppercase, lowercase, numbers, special chars)

**Expected Behavior:** 
- Minimum 8 characters
- Maximum 128 characters
- Should require complexity (optional but recommended)

**Test Cases - Boundary Values:**
- ❌ Should Reject: `` (empty)
- ❌ Should Reject: `a` (1 character)
- ❌ Should Reject: `1234567` (7 characters)
- ✅ Should Accept: `12345678` (8 characters - minimum)
- ✅ Should Accept: `ValidPass123!` (normal password)
- ❌ Should Reject: 129+ character passwords (above maximum)

---

### 3. **SQL Injection Vulnerability**
**Location:** `script.js` - `sanitizeInput()` function

**Bug Description:**
- No input sanitization performed
- Returns user input as-is
- Vulnerable to SQL injection attacks
- Also vulnerable to XSS (Cross-Site Scripting)

**Expected Behavior:** Should escape special characters and sanitize input

**Test Cases:**
- Try injecting: `' OR '1'='1`
- Try XSS: `<script>alert('XSS')</script>`
- Try SQL: `admin'--`
- Check console logs for unsanitized data exposure

---

### 4. **Empty Field Submission**
**Location:** `script.js` - `handleLogin()` function

**Bug Description:**
- Shows error messages for empty fields
- BUT still processes the login even when validation fails
- Error messages are displayed but don't prevent submission

**Expected Behavior:** Should prevent form submission until all validations pass

**Test Cases:**
- Submit with both fields empty
- Submit with only email filled
- Submit with only password filled
- Check if form actually prevents submission or just shows warnings

---

### 5. **Additional Security Issues**

#### a) **XSS Vulnerability in Display**
**Location:** `processLogin()` function
- Displays user input directly in DOM without escaping
- Could execute malicious scripts

#### b) **No Rate Limiting**
**Location:** `trackLoginAttempt()` function
- No limit on login attempts
- Vulnerable to brute force attacks

#### c) **Insecure Local Storage**
**Location:** `rememberUser()` function
- Stores email in plain text in localStorage
- No encryption for sensitive data

## 🧪 Testing Strategy

### Boundary Value Testing

Test the edges and limits of input fields:

| Field | Minimum | Maximum | Invalid | Valid |
|-------|---------|---------|---------|-------|
| Email | N/A | N/A | Various invalid formats | valid@example.com |
| Password | 0 chars | No limit | Too short | 8+ characters |

### Functional Testing

- [ ] Can user access the login page?
- [ ] Are all form elements visible and properly styled?
- [ ] Do validation messages appear when appropriate?
- [ ] Does the form submit?
- [ ] Does success message display after "login"?
- [ ] Does "Remember me" checkbox work?
- [ ] Are links functional?

### Security Testing

- [ ] SQL Injection attempts
- [ ] XSS attack attempts
- [ ] Input sanitization checks
- [ ] Password visibility toggling
- [ ] Browser console for exposed sensitive data

### Usability Testing

- [ ] Mobile responsiveness
- [ ] Keyboard navigation
- [ ] Screen reader accessibility
- [ ] Visual feedback on interactions
- [ ] Error message clarity

## 💻 How to Use

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ronit0000/Login-Page.git
cd Login-Page
```

2. Open `index.html` in your browser:
   - Double-click the file, or
   - Use a local server: `python -m http.server 8000`

3. Test the login form with various inputs

### GitHub Pages Deployment

1. Push code to GitHub repository
2. Go to repository Settings
3. Navigate to "Pages" section
4. Select branch (main/master) and root folder
5. Save and wait for deployment
6. Access at: `https://ronit0000.github.io/Login-Page/`

## 🎨 Features (Working Correctly)

✅ Responsive design (works on mobile, tablet, desktop)
✅ Modern gradient background
✅ Smooth animations
✅ Clean and professional UI
✅ Form structure
✅ CSS styling

## 📝 Testing Checklist

### Test Scenarios to Execute:

1. **Valid Login**
   - Enter: `test@example.com` / `password123`
   - Expected: Success message appears

2. **Invalid Email Formats**
   - Test: `plaintext`, `@domain.com`, `user@`, `user@@domain.com`
   - Expected: Should reject but may accept due to bug

3. **Weak Passwords**
   - Test: `1`, `ab`, `short`
   - Expected: Should reject but accepts due to bug

4. **Empty Submissions**
   - Submit form with empty fields
   - Expected: Should block but may process

5. **SQL Injection**
   - Email: `admin'--`
   - Check console logs

6. **XSS Attack**
   - Email: `<script>alert('XSS')</script>`
   - Check if script executes

## 🔧 Technologies Used

- HTML5
- CSS3 (with Flexbox & Animations)
- Vanilla JavaScript (ES6+)
- GitHub Pages for hosting

## 📚 Learning Objectives

Through testing this application, you will learn:

1. How to identify boundary value issues
2. Importance of input validation
3. Security vulnerabilities in web applications
4. Difference between client-side and server-side validation
5. Test case design and execution
6. Bug documentation and reporting

## 🤝 Contributing

This project is for educational purposes. Feel free to:
- Add more test cases
- Document additional bugs
- Improve test coverage
- Suggest security improvements

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created for Testing Hackathon - February 2026

---

**Remember:** This is a deliberately vulnerable application for testing practice. Never use this code in production!
