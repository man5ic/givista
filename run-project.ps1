# Givista Project - Complete Setup and Run Script
# This script will help you set up and run all services

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Givista Project Setup & Run" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Get the project root directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"
$aiServicePath = Join-Path $projectRoot "ai_service"

# Step 1: Create .env files
Write-Host "Step 1: Setting up environment files..." -ForegroundColor Yellow

$backendEnv = Join-Path $backendPath ".env"
$frontendEnv = Join-Path $frontendPath ".env"

# Create Backend .env if it doesn't exist
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
    Write-Host "⚠️  IMPORTANT: You need to edit backend\.env and add your MySQL password!" -ForegroundColor Red
    Write-Host "   Open: $backendEnv" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ backend\.env already exists" -ForegroundColor Green
}

# Create Frontend .env if it doesn't exist
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

# Step 2: Check MySQL and create database
Write-Host "Step 2: Setting up database..." -ForegroundColor Yellow

# Check if MySQL service is running
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq "Running") {
        Write-Host "✅ MySQL service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MySQL service is not running. Attempting to start..." -ForegroundColor Yellow
        try {
            Start-Service -Name $mysqlService.Name
            Write-Host "✅ MySQL service started" -ForegroundColor Green
        } catch {
            Write-Host "❌ Could not start MySQL service. Please start it manually." -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  Could not detect MySQL service. Make sure MySQL is installed and running." -ForegroundColor Yellow
}

# Try to create database
Write-Host "Attempting to create database..." -ForegroundColor Yellow
Set-Location $backendPath
if (Test-Path "node_modules") {
    try {
        node create-db.js
        Write-Host "✅ Database setup complete" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not create database automatically. You may need to create it manually:" -ForegroundColor Yellow
        Write-Host "   Run: CREATE DATABASE givista_db; in MySQL" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  Backend dependencies not installed. Run 'npm install' in backend folder first." -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Check dependencies
Write-Host "Step 3: Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Path (Join-Path $backendPath "node_modules"))) {
    Write-Host "⚠️  Backend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd backend && npm install" -ForegroundColor White
} else {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}

if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "⚠️  Frontend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd frontend && npm install" -ForegroundColor White
} else {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}

if (-not (Test-Path (Join-Path $aiServicePath "venv"))) {
    Write-Host "⚠️  AI service virtual environment not found" -ForegroundColor Yellow
    Write-Host "   Run: cd ai_service && python -m venv venv" -ForegroundColor White
} else {
    Write-Host "✅ AI service virtual environment exists" -ForegroundColor Green
}

Write-Host ""

# Step 4: Instructions
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Ready to Start!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Before starting, make sure:" -ForegroundColor Red
Write-Host "   1. Edit backend\.env and add your MySQL password to DB_PASSWORD=" -ForegroundColor Yellow
Write-Host "   2. MySQL service is running" -ForegroundColor Yellow
Write-Host "   3. Database 'givista_db' exists (will be created automatically if .env has password)" -ForegroundColor Yellow
Write-Host ""
Write-Host "To start all services, open 3 separate terminal windows:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Green
Write-Host "  cd `"$backendPath`"" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Green
Write-Host "  cd `"$frontendPath`"" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 3 - AI Service:" -ForegroundColor Green
Write-Host "  cd `"$aiServicePath`"" -ForegroundColor White
Write-Host "  venv\Scripts\activate" -ForegroundColor White
Write-Host "  python app.py" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

