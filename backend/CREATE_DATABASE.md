# 🗄️ Create MySQL Database

## Quick Steps to Create Database

Since the password is now set to `SHREE`, you need to create the database if it doesn't exist.

### Option 1: Using MySQL Command Line

1. Open a new PowerShell/Command Prompt
2. Navigate to MySQL bin directory (usually):
   ```powershell
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   ```
   Or find your MySQL installation path.

3. Run:
   ```powershell
   .\mysql.exe -u root -pSHREE -e "CREATE DATABASE IF NOT EXISTS givista_db;"
   ```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect with:
   - Username: `root`
   - Password: `SHREE`
3. Run this SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS givista_db;
   ```

### Option 3: The Server Will Auto-Create

Actually, Sequelize should automatically create the database when it connects. The issue might be that the user doesn't have CREATE DATABASE permission, or the connection is still failing.

---

## ✅ After Creating Database

Once the database is created:
1. The server should automatically restart (nodemon watches for changes)
2. You should see: `✅ Database connection established successfully.`
3. You should see: `✅ Database models synced.`
4. You should see: `🚀 Server is running on http://localhost:3000`

---

## 🧪 Test Connection

After setting the password, check your terminal. The server should have auto-restarted.

If you still see "Access denied", the password might be wrong, or there might be a permission issue.

