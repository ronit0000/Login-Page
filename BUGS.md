# 🐛 Known Bugs & Vulnerabilities

## ⚠️ Intentional Bugs for Testing

This document lists all intentional bugs planted in the login page for testing purposes.

---

## BUG #1: Email Validation Issues

**Severity:** HIGH  
**Type:** Validation / Functional  
**File:** `script.js` - Line 10-14  
**Function:** `validateEmail()`

### Description
The email validation is extremely weak and only checks if the '@' symbol is present in the input.

### Current Code
```javascript
function validateEmail(email) {
    return email.includes('@');
}
```

### Issues
- Accepts `@` alone
- Accepts `test@` (no domain)
- Accepts `@domain.com` (no username)
- Accepts `test@@domain.com` (multiple @)
- Accepts `test@domain` (no TLD)
- No regex pattern matching

### Expected Behavior
Should validate:
- Username exists
- @ symbol present
- Domain name exists
- TLD (top-level domain) exists
- Proper format: `username@domain.tld`

### Test Cases
```
❌ Should Reject: ""
❌ Should Reject: "test"
❌ Should Reject: "test@"
❌ Should Reject: "@domain.com"
❌ Should Reject: "test@@domain.com"
❌ Should Reject: "test@domain"
✅ Should Accept: "user@example.com"
✅ Should Accept: "user.name@example.co.uk"
```

### Fix Suggestion
```javascript
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

---

## BUG #2: Missing Boundary Checks

**Severity:** HIGH  
**Type:** Validation / Security  
**File:** `script.js` - Line 21-26  
**Function:** `validatePassword()`

### Description
No password length validation exists. Accepts passwords of ANY length including empty strings.

### Current Code
```javascript
function validatePassword(password) {
    // INTENTIONAL BUG: No length validation at all
    return true; // Always returns true
}
```

### Issues
- No minimum length requirement
- No maximum length requirement
- No complexity requirements
- Always returns `true`

### Expected Behavior
Should validate:
- Minimum 8 characters
- Maximum 128 characters (reasonable limit)
- Optional: Complexity requirements
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### Test Cases - Boundary Values
```
❌ Should Reject: "" (0 chars)
❌ Should Reject: "a" (1 char)
❌ Should Reject: "1234567" (7 chars - below minimum)
✅ Should Accept: "12345678" (8 chars - at minimum)
✅ Should Accept: "ValidPass123!" (good password)
❌ Should Reject: [129+ characters] (above maximum)
```

### Fix Suggestion
```javascript
function validatePassword(password) {
    const minLength = 8;
    const maxLength = 128;
    
    if (password.length < minLength || password.length > maxLength) {
        return false;
    }
    
    // Optional: Add complexity requirements
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    return hasUpper && hasLower && hasNumber && hasSpecial;
}
```

---

## BUG #3: SQL Injection Vulnerability

**Severity:** CRITICAL  
**Type:** Security  
**File:** `script.js` - Line 33-38  
**Function:** `sanitizeInput()`

### Description
No input sanitization is performed. User input is returned as-is, making the application vulnerable to SQL injection and XSS attacks.

### Current Code
```javascript
function sanitizeInput(input) {
    // INTENTIONAL BUG: No sanitization performed
    return input; // Returns input as-is
}
```

### Issues
- No escaping of special characters
- Vulnerable to SQL injection
- Vulnerable to XSS (Cross-Site Scripting)
- Raw user input used directly

### Attack Vectors
```javascript
// SQL Injection attempts:
"admin'--"
"' OR '1'='1"
"'; DROP TABLE users;--"
"' UNION SELECT * FROM users--"

// XSS attempts:
"<script>alert('XSS')</script>"
"<img src=x onerror=alert('XSS')>"
"javascript:alert('XSS')"
"<h1>Injected HTML</h1>"
```

### Expected Behavior
Should sanitize all user input by:
- Escaping special characters
- Removing or encoding HTML tags
- Preventing script execution
- Using parameterized queries (server-side)

### Fix Suggestion
```javascript
function sanitizeInput(input) {
    // Escape HTML special characters
    const div = document.createElement('div');
    div.textContent = input;
    const escaped = div.innerHTML;
    
    // Remove potential SQL injection characters
    const sanitized = escaped
        .replace(/'/g, "''")  // Escape single quotes
        .replace(/;/g, '')     // Remove semicolons
        .replace(/--/g, '')    // Remove SQL comments
        .replace(/\/\*/g, '')  // Remove block comments
        .replace(/\*\//g, '');
    
    return sanitized;
}
```

**Note:** Client-side sanitization is NOT enough. Server-side validation and parameterized queries are essential.

---

## BUG #4: Empty Field Submission

**Severity:** HIGH  
**Type:** Validation / Functional  
**File:** `script.js` - Line 45-80  
**Function:** `handleLogin()`

### Description
Even when validation fails and error messages are shown, the form still processes the login.

### Current Code
```javascript
if (!isValid) {
    console.log('Validation failed but processing anyway...');
}

// Still proceeds to process login even if validation failed
processLogin(sanitizedEmail, sanitizedPassword);
```

### Issues
- Shows error messages but doesn't prevent submission
- `isValid` flag is set to `false` but ignored
- Login processing continues regardless of validation
- No actual blocking of invalid submissions

### Expected Behavior
Should not proceed with login if validation fails. Should return early or prevent form processing.

### Test Cases
```
Test 1: Both fields empty
- Input: email="", password=""
- Current: Shows errors BUT processes login
- Expected: Show errors AND block login

Test 2: Only email filled
- Input: email="test@example.com", password=""
- Current: Shows error BUT processes login
- Expected: Show error AND block login

Test 3: Only password filled
- Input: email="", password="password123"
- Current: Shows error BUT processes login
- Expected: Show error AND block login
```

### Fix Suggestion
```javascript
if (!isValid) {
    console.log('Validation failed. Login blocked.');
    return; // Exit early, don't process login
}

// Only reached if validation passed
processLogin(sanitizedEmail, sanitizedPassword);
```

---

## BUG #5: No Rate Limiting

**Severity:** MEDIUM  
**Type:** Security  
**File:** `script.js` - Line 115-120  
**Function:** `trackLoginAttempt()`

### Description
No rate limiting on login attempts, vulnerable to brute force attacks.

### Current Code
```javascript
let loginAttempts = 0;
function trackLoginAttempt() {
    loginAttempts++;
    console.log('Login attempts:', loginAttempts);
}
```

### Issues
- Tracks attempts but doesn't limit them
- No lockout mechanism
- No CAPTCHA after multiple failures
- Allows unlimited brute force attempts

### Expected Behavior
After 3-5 failed attempts:
- Implement progressive delays
- Show CAPTCHA
- Temporarily lock account
- Alert user via email

---

## BUG #6: Insecure Data Storage

**Severity:** MEDIUM  
**Type:** Security  
**File:** `script.js` - Line 123-129  
**Function:** `rememberUser()`

### Description
Stores email in plain text in localStorage without encryption.

### Current Code
```javascript
function rememberUser(email) {
    if (rememberMe) {
        localStorage.setItem('userEmail', email);
    }
}
```

### Issues
- Plain text storage
- No encryption
- Accessible via browser dev tools
- Persists across sessions

### Expected Behavior
- Encrypt sensitive data before storage
- Use secure tokens instead of email
- Implement proper session management
- Use httpOnly cookies for auth tokens

---

## BUG #7: XSS Vulnerability in Display

**Severity:** HIGH  
**Type:** Security  
**File:** `script.js` - Line 100-105  
**Function:** `processLogin()`

### Description
Displays user input directly in the DOM without escaping, allowing potential XSS attacks.

### Current Code
```javascript
document.getElementById('userEmail').textContent = `Logged in as: ${email}`;
```

### Issues
- While `textContent` is safer than `innerHTML`, the input should still be sanitized
- Email could contain malicious content
- No validation before display

### Attack Vector
If email contains: `<script>alert('XSS')</script>`  
And code used `innerHTML` instead, script would execute.

### Fix
Always sanitize before displaying and prefer `textContent` over `innerHTML`.

---

## 📊 Bug Summary

| Bug ID | Title | Severity | Type | Status |
|--------|-------|----------|------|--------|
| BUG-1 | Email Validation Issues | HIGH | Validation | Open |
| BUG-2 | Missing Boundary Checks | HIGH | Validation | Open |
| BUG-3 | SQL Injection Vulnerability | CRITICAL | Security | Open |
| BUG-4 | Empty Field Submission | HIGH | Functional | Open |
| BUG-5 | No Rate Limiting | MEDIUM | Security | Open |
| BUG-6 | Insecure Data Storage | MEDIUM | Security | Open |
| BUG-7 | XSS Vulnerability | HIGH | Security | Open |

---

## 🎯 Testing Priority

1. **Critical** - BUG #3 (SQL Injection)
2. **High** - BUG #1, #2, #4, #7
3. **Medium** - BUG #5, #6

---

## 📝 Notes for Testers

- All bugs are intentional for educational purposes
- Do NOT use this code in production
- Focus on boundary value analysis and security testing
- Document all findings with evidence
- Create comprehensive test reports

**Happy Testing! 🧪**
