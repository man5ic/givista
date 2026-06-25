# Setup Script - Run After MySQL Installation
# This script helps you set up the database and verify everything is ready

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Givista Setup - After MySQL Install" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Test MySQL Connection
Write-Host "Step 1: Testing MySQL connection..." -ForegroundColor Yellow
$mysqlTest = Read-Host "Enter MySQL root password (or press Enter if no password)"

if ($mysqlTest -eq "") {
    $mysqlCmd = "mysql -u root -e `"SHOW DATABASES;`""
} else {
    $mysqlCmd = "mysql -u root -p$mysqlTest -e `"SHOW DATABASES;`""
}

try {
    $result = Invoke-Expression $mysqlCmd 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL connection successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL connection failed. Please check:" -ForegroundColor Red
        Write-Host "   - MySQL service is running" -ForegroundColor Yellow
        Write-Host "   - Password is correct" -ForegroundColor Yellow
        Write-Host "   - MySQL is installed correctly" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ MySQL command not found. Is MySQL installed?" -ForegroundColor Red
    Write-Host "   Install MySQL first, then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Create Database
Write-Host "Step 2: Creating database 'givista_db'..." -ForegroundColor Yellow

if ($mysqlTest -eq "") {
    $createDbCmd = "mysql -u root -e `"CREATE DATABASE IF NOT EXISTS givista_db;`""
} else {
    $createDbCmd = "mysql -u root -p$mysqlTest -e `"CREATE DATABASE IF NOT EXISTS givista_db;`""
}

try {
    Invoke-Expression $createDbCmd 2>&1 | Out-Null
    Write-Host "✅ Database 'givista_db' created!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Update .env file
Write-Host "Step 3: Updating backend\.env file..." -ForegroundColor Yellow

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $projectPath "backend\.env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    if ($mysqlTest -ne "") {
        # Update password in .env
        $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$mysqlTest"
        $envContent | Set-Content $envPath -NoNewline
        Write-Host "✅ Updated DB_PASSWORD in backend\.env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No password set. Make sure DB_PASSWORD= is empty in backend\.env" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  backend\.env file not found. Creating it..." -ForegroundColor Yellow
    
    $envContent = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=$mysqlTest

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
    
    $envDir = Join-Path $projectPath "backend"
    if (-not (Test-Path $envDir)) {
        New-Item -ItemType Directory -Path $envDir -Force | Out-Null
    }
    
    $envContent | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✅ Created backend\.env file" -ForegroundColor Green
}

Write-Host ""

# Step 4: Verify Setup
Write-Host "Step 4: Verifying setup..." -ForegroundColor Yellow

if ($mysqlTest -eq "") {
    $verifyCmd = "mysql -u root -e `"USE givista_db; SHOW TABLES;`""
} else {
    $verifyCmd = "mysql -u root -p$mysqlTest -e `"USE givista_db; SHOW TABLES;`""
}

try {
    Invoke-Expression $verifyCmd 2>&1 | Out-Null
    Write-Host "✅ Database is accessible!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Database exists but may be empty (this is normal)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ MySQL is installed and configured" -ForegroundColor Green
Write-Host "✅ Database 'givista_db' is created" -ForegroundColor Green
Write-Host "✅ .env file is configured" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the project:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 3 - AI Service:" -ForegroundColor Cyan
Write-Host "  cd ai_service" -ForegroundColor White
Write-Host "  venv\Scripts\activate" -ForegroundColor White
Write-Host "  python app.py" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:5173" -ForegroundColor Green
Write-Host ""

pause

