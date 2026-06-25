# MySQL Installation Guide for Windows

## Option 1: Install MySQL Community Server (Recommended)

### Step 1: Download MySQL
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download: **MySQL Installer for Windows** (the larger file, ~400MB)
   - Choose: `mysql-installer-community-8.0.x.x.msi`

### Step 2: Run the Installer
1. Double-click the downloaded `.msi` file
2. Choose **"Developer Default"** or **"Server only"** setup type
3. Click **"Execute"** to install required components
4. Click **"Next"** through the configuration

### Step 3: Configure MySQL Server
1. **Type and Networking**: Keep defaults (Standalone, Port 3306)
2. **Authentication Method**: Choose **"Use Strong Password Encryption"**
3. **Accounts and Roles**: 
   - Set **root password** (remember this! You'll need it for `.env` file)
   - Example: `root123` or your own secure password
4. **Windows Service**: 
   - Check **"Configure MySQL Server as a Windows Service"**
   - Service name: `MySQL80`
   - Check **"Start the MySQL Server at System Startup"**
5. Click **"Execute"** to apply configuration

### Step 4: Verify Installation
1. Open Command Prompt or PowerShell
2. Run: `mysql --version`
3. Should show: `mysql Ver 8.0.x`

### Step 5: Test Connection
```powershell
mysql -u root -p
```
Enter your root password. If it works, MySQL is installed correctly!

---

## Option 2: Install XAMPP (Easier Alternative)

XAMPP includes MySQL, Apache, PHP, and phpMyAdmin in one package.

### Step 1: Download XAMPP
1. Go to: https://www.apachefriends.org/download.html
2. Download: **XAMPP for Windows** (latest version)

### Step 2: Install XAMPP
1. Run installer
2. Installation location: `C:\xampp` (default)
3. Select components: Make sure **MySQL** is checked
4. Complete installation

### Step 3: Start MySQL
1. Open **XAMPP Control Panel**
2. Click **"Start"** next to MySQL
3. Status should turn green

### Step 4: Set Root Password (Optional but Recommended)
1. Open Command Prompt
2. Navigate to: `C:\xampp\mysql\bin`
3. Run:
```powershell
mysql -u root
```
4. Then in MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Update .env File
In `backend\.env`, set:
```env
DB_PASSWORD=your_password
```
(If you didn't set a password, leave it empty: `DB_PASSWORD=`)

---

## Option 3: Use Cloud MySQL (No Installation Needed)

### Free Cloud MySQL Options:
1. **PlanetScale** (Free tier): https://planetscale.com/
2. **Railway** (Free tier): https://railway.app/
3. **Aiven** (Free trial): https://aiven.io/

### Steps:
1. Sign up for a free account
2. Create a MySQL database
3. Get connection details (host, port, username, password)
4. Update `backend\.env`:
```env
DB_HOST=your_cloud_host
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
```

---

## After Installation: Create Database

Once MySQL is installed and running:

### Method 1: Using Command Line
```powershell
mysql -u root -p
```
Enter password, then:
```sql
CREATE DATABASE givista_db;
EXIT;
```

### Method 2: Using MySQL Workbench
1. Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Connect to localhost
3. Run: `CREATE DATABASE givista_db;`

### Method 3: Using phpMyAdmin (if using XAMPP)
1. Open: http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: `givista_db`
4. Click "Create"

---

## Quick Test

After installation, test your setup:

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS givista_db; SHOW DATABASES;"
```

If you see `givista_db` in the list, you're ready to go!

---

## Troubleshooting

### MySQL service won't start?
- Check if port 3306 is already in use
- Run XAMPP/MySQL as Administrator
- Check Windows Services: `services.msc` → Find MySQL → Right-click → Start

### Can't connect?
- Make sure MySQL service is running
- Check firewall settings
- Verify password in `.env` file

### Forgot root password?
- See: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
- Or reinstall MySQL (easier for development)

---

**Recommended for beginners: Use XAMPP (Option 2) - it's the easiest!**

