#!/bin/bash

# Modern WebApp Comprehensive Testing Script
# Using Ollama with gemma3:27b model

echo "Starting comprehensive testing of Modern WebApp..."
echo "================================================"

# Create test results directory
mkdir -p test-results
REPORT_FILE="test-results/comprehensive-test-report-$(date +%Y%m%d-%H%M%S).md"

# Initialize report
cat > "$REPORT_FILE" << 'EOF'
# Modern WebApp Comprehensive Test Report

**Date:** $(date)
**Model:** gemma3:27b via Ollama

## Table of Contents
1. [TypeScript Type Checking](#typescript-type-checking)
2. [Import/Export Analysis](#importexport-analysis)
3. [API Endpoints Validation](#api-endpoints-validation)
4. [React Components Testing](#react-components-testing)
5. [Authentication Flow](#authentication-flow)
6. [Database Schema Consistency](#database-schema-consistency)
7. [Form Validations](#form-validations)
8. [Responsive Design](#responsive-design)
9. [Email Templates](#email-templates)
10. [Security Implementation](#security-implementation)

---

EOF

# Function to run Ollama analysis
analyze_with_ollama() {
    local prompt=$1
    local context=$2
    echo "$context" | ollama run gemma3:27b "$prompt" 2>/dev/null
}

# 1. TypeScript Type Checking
echo "1. Checking TypeScript files for type errors..."
echo "## 1. TypeScript Type Checking" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Get all TypeScript files
TS_FILES=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next)

# Analyze TypeScript files
TS_ANALYSIS=$(echo "$TS_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== FILE: $file ==="
        cat "$file"
    fi
done | analyze_with_ollama "Analyze the following TypeScript files for type errors, missing type annotations, and potential type safety issues. List specific issues found:")

echo "$TS_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 2. Import/Export Analysis
echo "2. Verifying imports and exports..."
echo "## 2. Import/Export Analysis" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

IMPORT_ANALYSIS=$(echo "$TS_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== FILE: $file ==="
        grep -E "^import|^export|from ['\"]" "$file" 2>/dev/null || true
    fi
done | analyze_with_ollama "Analyze these import/export statements. Check for: 1) Missing imports 2) Circular dependencies 3) Incorrect import paths 4) Unused exports. List any issues found:")

echo "$IMPORT_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 3. API Endpoints Validation
echo "3. Checking API endpoints..."
echo "## 3. API Endpoints Validation" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

API_FILES=$(find ./app/api -name "route.ts" | grep -v node_modules)

API_ANALYSIS=$(echo "$API_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== ENDPOINT: $file ==="
        cat "$file"
    fi
done | analyze_with_ollama "Analyze these API endpoints for: 1) Proper HTTP method handling 2) Error handling 3) Input validation 4) Response format consistency 5) Authentication checks. List issues and recommendations:")

echo "$API_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 4. React Components Testing
echo "4. Validating React components..."
echo "## 4. React Components Testing" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

COMPONENT_FILES=$(find . -name "*.tsx" | grep -E "components|app" | grep -v node_modules | grep -v .next)

COMPONENT_ANALYSIS=$(echo "$COMPONENT_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== COMPONENT: $file ==="
        cat "$file"
    fi
done | analyze_with_ollama "Analyze these React components for: 1) Proper hooks usage 2) State management issues 3) Props validation 4) Rendering errors 5) Performance issues. List specific problems:")

echo "$COMPONENT_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 5. Authentication Flow
echo "5. Checking authentication flow..."
echo "## 5. Authentication Flow" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

AUTH_FILES=$(find . -path "*auth*" -name "*.ts" -o -path "*auth*" -name "*.tsx" | grep -v node_modules | grep -v .next)

AUTH_ANALYSIS=$(echo "$AUTH_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== AUTH FILE: $file ==="
        cat "$file"
    fi
done | analyze_with_ollama "Analyze the authentication flow for: 1) Security vulnerabilities 2) Session management 3) Token handling 4) Password security 5) Authorization checks. Provide detailed security assessment:")

echo "$AUTH_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 6. Database Schema Consistency
echo "6. Verifying database schema..."
echo "## 6. Database Schema Consistency" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

SCHEMA_ANALYSIS=$(cat ./prisma/schema.prisma | analyze_with_ollama "Analyze this Prisma schema for: 1) Relationship consistency 2) Index optimization 3) Data type appropriateness 4) Missing constraints 5) Security considerations:")

echo "$SCHEMA_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 7. Form Validations
echo "7. Testing form validations..."
echo "## 7. Form Validations" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

VALIDATION_FILES=$(find . -path "*validations*" -name "*.ts" -o -name "*form*.tsx" | grep -v node_modules | grep -v .next)

VALIDATION_ANALYSIS=$(echo "$VALIDATION_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== VALIDATION FILE: $file ==="
        cat "$file"
    fi
done | analyze_with_ollama "Analyze form validations for: 1) Input sanitization 2) Validation completeness 3) Error handling 4) XSS prevention 5) SQL injection prevention. List issues:")

echo "$VALIDATION_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 8. Responsive Design
echo "8. Checking responsive design..."
echo "## 8. Responsive Design" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

CSS_ANALYSIS=$(find . -name "*.css" -o -name "*.tsx" | xargs grep -l "className\|tailwind" 2>/dev/null | head -20 | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== STYLE FILE: $file ==="
        grep -E "className|sm:|md:|lg:|xl:|2xl:" "$file" 2>/dev/null || true
    fi
done | analyze_with_ollama "Analyze responsive design implementation: 1) Mobile-first approach 2) Breakpoint consistency 3) Layout issues 4) Accessibility concerns:")

echo "$CSS_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 9. Email Templates
echo "9. Validating email templates..."
echo "## 9. Email Templates" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

EMAIL_FILES=$(find ./emails -name "*.tsx" | grep -v node_modules)

EMAIL_ANALYSIS=$(echo "$EMAIL_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== EMAIL TEMPLATE: $file ==="
        cat "$file"
    fi
done | analyze_with_ollama "Analyze email templates for: 1) HTML validity 2) Cross-client compatibility 3) Responsive design 4) Accessibility 5) Content security:")

echo "$EMAIL_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 10. Security Implementation
echo "10. Reviewing security implementations..."
echo "## 10. Security Implementation" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

SECURITY_FILES=$(find . -name "middleware.ts" -o -name "*auth*.ts" -o -name "*token*.ts" | grep -v node_modules | grep -v .next)

SECURITY_ANALYSIS=$(echo "$SECURITY_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "=== SECURITY FILE: $file ==="
        cat "$file"
    fi
done | analyze_with_ollama "Perform security analysis for: 1) Authentication vulnerabilities 2) Authorization flaws 3) CSRF protection 4) XSS prevention 5) SQL injection 6) Token security 7) Session management. Provide detailed security recommendations:")

echo "$SECURITY_ANALYSIS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Summary
echo "## Summary and Recommendations" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

SUMMARY=$(cat "$REPORT_FILE" | analyze_with_ollama "Based on all the analysis above, provide a concise summary of: 1) Critical issues found 2) High-priority fixes needed 3) Overall code quality assessment 4) Top 5 recommendations for improvement:")

echo "$SUMMARY" >> "$REPORT_FILE"

echo "================================================"
echo "Testing completed! Report saved to: $REPORT_FILE"