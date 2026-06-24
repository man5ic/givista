# Givista Project Setup and Run Script
# This script helps you set up and run the Givista project

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Givista Project Setup" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if .env files exist
Write-Host "Step 1: Checking .env files..." -ForegroundColor Yellow

$backendEnv = "backend\.env"
$frontendEnv = "frontend\.env"

# Check Backend .env
if (-not (Test-Path $backendEnv)) {
    Write-Host "Creating backend\.env file..." -ForegroundColor Yellow
    $backendEnvContent = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# AI Microservice URL
AI_SERVICE_URL=http://localhost:5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
"@
    $backendEnvContent | Out-File -FilePath $backendEnv -Encoding utf8
    Write-Host "✅ Created backend\.env" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit backend\.env and add your MySQL password!" -ForegroundColor Red
} else {
    Write-Host "✅ backend\.env already exists" -ForegroundColor Green
}

# Check Frontend .env
if (-not (Test-Path $frontendEnv)) {
    Write-Host "Creating frontend\.env file..." -ForegroundColor Yellow
    $frontendEnvContent = @"
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:5000
"@
    $frontendEnvContent | Out-File -FilePath $frontendEnv -Encoding utf8
    Write-Host "✅ Created frontend\.env" -ForegroundColor Green
} else {
    Write-Host "✅ frontend\.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Next Steps" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edit backend\.env and add your MySQL password:" -ForegroundColor Yellow
Write-Host "   DB_PASSWORD=your_mysql_password_here" -ForegroundColor White
Write-Host ""
Write-Host "2. Make sure MySQL is running and database 'givista_db' exists" -ForegroundColor Yellow
Write-Host "   Run: CREATE DATABASE givista_db; in MySQL" -ForegroundColor White
Write-Host ""
Write-Host "3. Open 3 separate terminal windows and run:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 3 (AI Service):" -ForegroundColor Cyan
Write-Host "   cd ai_service" -ForegroundColor White
Write-Host "   venv\Scripts\activate" -ForegroundColor White
Write-Host "   python app.py" -ForegroundColor White
Write-Host ""
Write-Host "4. Open browser: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "For detailed instructions, see: RUN_PROJECT.md" -ForegroundColor Cyan
Write-Host ""

pause

