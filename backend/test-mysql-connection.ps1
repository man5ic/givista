# Test MySQL Connection Script
# This script helps you find the correct MySQL password

Write-Host "Testing MySQL connection..." -ForegroundColor Yellow
Write-Host ""

# Test with current password from .env
$envContent = Get-Content .env
$password = ($envContent | Select-String "DB_PASSWORD=").ToString().Split("=")[1]

Write-Host "Current password in .env: $password" -ForegroundColor Cyan
Write-Host ""

# Try to connect using MySQL command line (if available)
Write-Host "To test your MySQL password, try one of these:" -ForegroundColor Green
Write-Host ""
Write-Host "Option 1: Open MySQL Workbench and check your saved connection" -ForegroundColor Yellow
Write-Host "Option 2: Try connecting via command line:" -ForegroundColor Yellow
Write-Host "  mysql -u root -p" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: If MySQL is installed via XAMPP/WAMP:" -ForegroundColor Yellow
Write-Host "  The password might be empty (no password)" -ForegroundColor White
Write-Host ""

