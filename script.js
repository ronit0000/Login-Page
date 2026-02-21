// Login Form Handler with Intentional Bugs for Testing

/**
 * BUG #1: Email Validation Issues
 * - Accepts invalid email formats
 * - Very loose validation that allows malformed emails
 */
function validateEmail(email) {
    // INTENTIONAL BUG: Extremely weak email validation
    // This will accept invalid emails like "test", "test@", "@domain.com", etc.
    return email.includes('@');
}

/**
 * BUG #2: Missing Boundary Checks
 * - No minimum or maximum length validation
 * - Accepts passwords of any length (even 1 character)
 */
function validatePassword(password) {
    // INTENTIONAL BUG: No length validation at all
    // Should check for minimum 8 characters, maximum limits, etc.
    return true; // Always returns true
}

/**
 * BUG #3: SQL Injection Vulnerability
 * - No input sanitization
 * - Directly uses user input without escaping
 */
function sanitizeInput(input) {
    // INTENTIONAL BUG: No sanitization performed
    // Vulnerable to SQL injection and XSS attacks
    return input; // Returns input as-is without any cleaning
}

/**
 * BUG #4: Empty Field Submission
 * - Allows form submission with empty fields
 * - No proper required field validation
 */
function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Clear previous errors
    emailError.textContent = '';
    passwordError.textContent = '';
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    let isValid = true;
    
    // INTENTIONAL BUG: Very weak validation that allows empty fields
    // Only shows error if field is completely empty, but also proceeds anyway
    if (email === '') {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(email)) {
        emailError.textContent = 'Invalid email format';
        isValid = false;
    }
    
    if (password === '') {
        passwordError.textContent = 'Password is required';
        isValid = false;
    } else if (!validatePassword(password)) {
        passwordError.textContent = 'Invalid password';
        isValid = false;
    }
    
    // INTENTIONAL BUG: Even if validation fails, we still process the login
    // This allows empty submissions to go through
    if (!isValid) {
        console.log('Validation failed but processing anyway...');
    }
    
    // No actual sanitization performed (BUG #3)
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    
    // Simulate login (in real app, this would be an API call)
    processLogin(sanitizedEmail, sanitizedPassword);
}

/**
 * Process login - simulates authentication
 */
function processLogin(email, password) {
    // Log the unsanitized input (security vulnerability)
    console.log('Login attempt with:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Password length:', password.length);
    
    // Simulate successful login after 1 second
    setTimeout(() => {
        // Hide form and show success message
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('welcomeMessage').style.display = 'block';
        document.getElementById('userEmail').textContent = `Logged in as: ${email}`;
        
        // INTENTIONAL BUG: Displaying raw user input without escaping (XSS vulnerability)
        // This could execute malicious scripts if email contains HTML/JS
    }, 1000);
}

/**
 * Additional helper functions with intentional vulnerabilities
 */

// INTENTIONAL BUG: No rate limiting
let loginAttempts = 0;
function trackLoginAttempt() {
    loginAttempts++;
    // Should implement rate limiting after X attempts, but doesn't
    console.log('Login attempts:', loginAttempts);
}

// INTENTIONAL BUG: Storing sensitive data in localStorage without encryption
function rememberUser(email) {
    const rememberMe = document.getElementById('rememberMe').checked;
    if (rememberMe) {
        // VULNERABLE: Storing email in plain text
        localStorage.setItem('userEmail', email);
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded - Testing version with intentional bugs');
    console.log('Bugs included: Email validation, Boundary checks, SQL injection, Empty submissions');
});
