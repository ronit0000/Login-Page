// Login Form Handler with Intentional Bugs for Testing

/**
 * Email Validation - Proper validation with detailed checks
 * - Checks for valid email format
 * - Requires @ symbol with domain
 * - Returns error message if invalid, null if valid
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return 'Email is required';
    }
    
    if (email.length < 11) {
        return 'Email must be at least 11 characters';
    }
    
    if (email.length > 50) {
        return 'Email must not exceed 50 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    
    return null; // Valid
}

/**
 * Password Validation - Comprehensive boundary checks
 * - Requires minimum 8 characters
 * - Maximum 128 characters
 * - Returns error message if invalid, null if valid
 */
function validatePassword(password) {
    if (!password || password.trim() === '') {
        return 'Password is required';
    }
    
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    
    if (password.length > 128) {
        return 'Password is too long (max 128 characters)';
    }
    
    return null; // Valid
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
 * Proper Form Validation
 * - Validates all fields before submission
 * - Shows clear error messages
 * - Prevents submission if invalid
 */
function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Clear previous errors and styling
    emailError.textContent = '';
    passwordError.textContent = '';
    emailInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let isValid = true;
    
    // Validate email
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
        emailError.textContent = emailValidationError;
        emailInput.style.borderColor = '#e74c3c';
        isValid = false;
    } else {
        emailInput.style.borderColor = '#27ae60';
    }
    
    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
        passwordError.textContent = passwordValidationError;
        passwordInput.style.borderColor = '#e74c3c';
        isValid = false;
    } else {
        passwordInput.style.borderColor = '#27ae60';
    }
    
    // If validation fails, stop here and don't process login
    if (!isValid) {
        console.log('Validation failed - blocking login');
        console.log('Email error:', emailValidationError);
        console.log('Password error:', passwordValidationError);
        return; // Stop execution
    }
    
    console.log('Validation passed - processing login');
    
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

/**
 * Real-time validation on input
 */
function setupRealTimeValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Email real-time validation
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        const error = validateEmail(email);
        
        if (error) {
            emailError.textContent = error;
            this.style.borderColor = '#e74c3c';
        } else if (email) {
            emailError.textContent = '';
            this.style.borderColor = '#27ae60';
        } else {
            emailError.textContent = '';
            this.style.borderColor = '';
        }
    });
    
    // Password real-time validation
    passwordInput.addEventListener('blur', function() {
        const password = this.value;
        const error = validatePassword(password);
        
        if (error) {
            passwordError.textContent = error;
            this.style.borderColor = '#e74c3c';
        } else if (password) {
            passwordError.textContent = '';
            this.style.borderColor = '#27ae60';
        } else {
            passwordError.textContent = '';
            this.style.borderColor = '';
        }
    });
    
    // Clear errors on input
    emailInput.addEventListener('input', function() {
        if (this.value.trim()) {
            emailError.textContent = '';
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.value) {
            passwordError.textContent = '';
        }
    });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded - Enhanced validation version');
    console.log('Features: Real-time validation, Visual feedback, Proper error messages');
    
    // Setup real-time validation
    setupRealTimeValidation();
});
