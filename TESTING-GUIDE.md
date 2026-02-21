# Testing Guide - Login Page

## 🎯 Testing Objectives

This document provides a comprehensive guide for testing the login page with intentional bugs. Use this for your hackathon testing implementation.

## 📊 Test Case Template

```
Test Case ID: TC-XXX
Test Scenario: [Description]
Test Type: [Boundary/Functional/Security]
Priority: [High/Medium/Low]
Preconditions: [Setup required]
Test Steps: [Step-by-step]
Expected Result: [What should happen]
Actual Result: [What actually happens]
Status: [Pass/Fail]
Bug ID: [If failed, reference bug]
```

---

## 🧪 Boundary Value Test Cases

### Email Field Testing

| Test ID | Input Value | Input Type | Expected Result | Bug Present |
|---------|------------|------------|-----------------|-------------|
| BVT-001 | `` (empty) | Invalid | Error: "Email is required" | ✓ Shows error but submits |
| BVT-002 | `a` | Invalid | Error: Invalid email | ✓ Accepts if has @ |
| BVT-003 | `test@` | Invalid | Error: Invalid email | ✓ Accepts incomplete domain |
| BVT-004 | `@domain.com` | Invalid | Error: Invalid email | ✓ Accepts missing username |
| BVT-005 | `test@@example.com` | Invalid | Error: Invalid email | ✓ May accept multiple @ |
| BVT-006 | `user@domain` | Invalid | Error: Missing TLD | ✓ Accepts no TLD |
| BVT-007 | `valid@example.com` | Valid | Accept | Could work |
| BVT-008 | `user+tag@domain.co.uk` | Valid | Accept | Could work |
| BVT-009 | 320+ char email | Invalid | Error: Too long | ? No max limit |
| BVT-010 | Special chars `user!#$%@domain.com` | Edge case | Depends | ? Not validated |

### Password Field Testing

| Test ID | Input Value | Length | Expected Result | Bug Present |
|---------|------------|--------|-----------------|-------------|
| BVT-011 | `` (empty) | 0 | Error: "Password required" | ✓ Shows error but submits |
| BVT-012 | `a` | 1 | Error: Too short | ✓ Accepts any length |
| BVT-013 | `1234567` | 7 | Error: Min 8 chars | ✓ Accepts any length |
| BVT-014 | `12345678` | 8 | Accept (minimum) | ✓ Should be boundary |
| BVT-015 | `ValidPass123` | 12 | Accept | ✓ Works |
| BVT-016 | `Pass1!` | 6 | Error: Too short | ✓ Accepts any length |
| BVT-017 | 129+ characters | 129+ | Error: Too long | ✓ No max limit |
| BVT-018 | `        ` (spaces) | 8 | Error: Invalid | ? No trim check |
| BVT-019 | `NoNumbers!` | 11 | Depends on policy | ? No complexity check |
| BVT-020 | `12345678` (weak) | 8 | Warn or accept | ? No strength check |

---

## ⚙️ Functional Test Cases

### Form Display & UI

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---------|---------------|-------|-----------------|--------|
| FT-001 | Page loads correctly | 1. Open index.html | Page displays with login form | [ ] |
| FT-002 | All elements visible | 1. Check form elements | Email, password, button, links visible | [ ] |
| FT-003 | Responsive on mobile | 1. Resize to 375px | Layout adjusts properly | [ ] |
| FT-004 | Responsive on tablet | 1. Resize to 768px | Layout adjusts properly | [ ] |
| FT-005 | CSS styling applied | 1. Check visual appearance | Gradient background, rounded corners | [ ] |

### Form Validation

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---------|---------------|-------|-----------------|--------|
| FT-006 | Submit empty form | 1. Click Login without input | Error messages appear | [ ] |
| FT-007 | Submit with valid data | 1. Enter valid credentials<br>2. Click Login | Success message appears | [ ] |
| FT-008 | Error message display | 1. Submit invalid email | Red error text appears | [ ] |
| FT-009 | Error message clearing | 1. Show error<br>2. Correct input | Error clears on resubmit | [ ] |
| FT-010 | Remember me checkbox | 1. Check "Remember me"<br>2. Login | Checkbox state changes | [ ] |

### Form Submission

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---------|---------------|-------|-----------------|--------|
| FT-011 | Valid submission | 1. Fill valid data<br>2. Submit | Form hides, success message shows | [ ] |
| FT-012 | Invalid submission blocked | 1. Fill invalid data<br>2. Submit | Submission blocked | [ ] |
| FT-013 | Multiple submissions | 1. Submit valid<br>2. Try again | Prevent double submit | [ ] |
| FT-014 | Form reset | 1. Enter data<br>2. Refresh page | Form clears | [ ] |

### Link Functionality

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---------|---------------|-------|-----------------|--------|
| FT-015 | Forgot password link | 1. Click "Forgot password?" | Link responds (even if dummy) | [ ] |
| FT-016 | Create account link | 1. Click "Create new account" | Link responds (even if dummy) | [ ] |
| FT-017 | Link hover effect | 1. Hover over links | Color changes | [ ] |

---

## 🔒 Security Test Cases

### SQL Injection Testing

| Test ID | Attack Vector | Steps | Expected Result | Bug Present |
|---------|---------------|-------|-----------------|-------------|
| ST-001 | Basic SQL injection | Email: `admin'--`<br>Password: `any` | Reject & sanitize | ✓ No sanitization |
| ST-002 | OR statement injection | Email: `' OR '1'='1`<br>Password: `' OR '1'='1` | Reject & sanitize | ✓ No sanitization |
| ST-003 | UNION injection | Email: `' UNION SELECT * FROM users--` | Reject & sanitize | ✓ No sanitization |
| ST-004 | Comment injection | Email: `admin'/*`<br>Password: `*/` | Reject & sanitize | ✓ No sanitization |

### XSS (Cross-Site Scripting) Testing

| Test ID | Attack Vector | Steps | Expected Result | Bug Present |
|---------|---------------|-------|-----------------|-------------|
| ST-005 | Script tag injection | Email: `<script>alert('XSS')</script>` | Escape and display safely | ✓ May execute |
| ST-006 | Event handler injection | Email: `<img src=x onerror=alert('XSS')>` | Escape and display safely | ✓ May execute |
| ST-007 | JavaScript protocol | Email: `javascript:alert('XSS')` | Reject or sanitize | ✓ No sanitization |
| ST-008 | HTML injection | Email: `<h1>Hacked</h1>` | Escape HTML tags | ✓ May render HTML |

### Authentication & Session

| Test ID | Test Scenario | Steps | Expected Result | Bug Present |
|---------|---------------|-------|-----------------|-------------|
| ST-009 | Brute force protection | 1. Try 10+ wrong passwords | Account locks or rate limit | ✓ No rate limiting |
| ST-010 | Password visibility | 1. Check password field type | Type="password" (hidden) | ✓ Should be hidden |
| ST-011 | Console data exposure | 1. Login<br>2. Open dev console | No sensitive data logged | ✓ Passwords logged |
| ST-012 | LocalStorage security | 1. Check "Remember me"<br>2. Check localStorage | Data encrypted or secure | ✓ Plain text storage |

---

## 🎨 Usability Test Cases

### Keyboard Navigation

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---------|---------------|-------|-----------------|--------|
| UT-001 | Tab navigation | 1. Press Tab key | Focus moves through fields | [ ] |
| UT-002 | Enter to submit | 1. Fill form<br>2. Press Enter | Form submits | [ ] |
| UT-003 | Escape key | 1. Press Escape | Clear errors or close modal | [ ] |

### Accessibility

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---------|---------------|-------|-----------------|--------|
| UT-004 | Screen reader labels | 1. Use screen reader | All fields have labels | [ ] |
| UT-005 | Color contrast | 1. Check contrast ratio | Meets WCAG standards | [ ] |
| UT-006 | Focus indicators | 1. Tab through form | Focus visible on all elements | [ ] |

### Browser Compatibility

| Test ID | Browser | Version | Expected Result | Status |
|---------|---------|---------|-----------------|--------|
| UT-007 | Chrome | Latest | Full functionality | [ ] |
| UT-008 | Firefox | Latest | Full functionality | [ ] |
| UT-009 | Safari | Latest | Full functionality | [ ] |
| UT-010 | Edge | Latest | Full functionality | [ ] |

---

## 📝 Bug Report Template

When you find a bug (or confirm an intentional one), document it:

```markdown
### Bug Report: [Bug ID]

**Bug ID:** BUG-XXX
**Title:** [Short description]
**Severity:** [Critical/High/Medium/Low]
**Type:** [Validation/Security/Functional/UI]

**Description:**
[Detailed description of the bug]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Test Case Reference:** TC-XXX

**Screenshot/Evidence:**
[If applicable]

**Suggested Fix:**
[How to fix this bug]

**Status:** [Open/In Progress/Fixed/Won't Fix]
```

---

## 🎯 Priority Testing Areas

### High Priority
1. ✅ Empty field submission (BUG #4)
2. ✅ Password length validation (BUG #2)
3. ✅ SQL injection vulnerability (BUG #3)
4. ✅ Email validation (BUG #1)

### Medium Priority
5. Console data exposure
6. No rate limiting
7. Plain text localStorage

### Low Priority
8. Visual/UI bugs
9. Browser compatibility issues
10. Minor usability issues

---

## 📊 Test Metrics to Track

- **Total Test Cases:** Count all test cases
- **Test Cases Executed:** Number completed
- **Test Cases Passed:** Tests that pass
- **Test Cases Failed:** Tests that fail
- **Bugs Found:** Total bugs identified
- **Critical Bugs:** Severity level bugs
- **Test Coverage:** % of code/features tested

---

## 🚀 Next Steps

1. Execute all test cases systematically
2. Document results in test management tool
3. Create bug reports for each failure
4. Prioritize bugs by severity
5. Prepare test summary report
6. Present findings in hackathon

**Good luck with your testing! 🎉**
