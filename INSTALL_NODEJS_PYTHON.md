# Install Node.js and Python - Quick Guide

## ❌ Current Status
- ❌ Node.js/npm: **NOT INSTALLED** (needed for Backend & Frontend)
- ❌ Python: **NOT INSTALLED** (needed for AI Service)

---

## 📦 Step 1: Install Node.js (Required for Backend & Frontend)

### Download & Install:
1. **Go to:** https://nodejs.org/
2. **Download:** LTS version (Long Term Support) - recommended
   - Example: `node-v20.x.x-x64.msi` (Windows 64-bit)
3. **Run the installer:**
   - Click "Next" through the installation
   - ✅ **IMPORTANT:** Check "Automatically install the necessary tools" if prompted
   - ✅ **IMPORTANT:** Make sure "Add to PATH" is checked (should be by default)
4. **Restart your computer** (or close and reopen PowerShell)

### Verify Installation:
Open a **NEW** PowerShell window and run:
```powershell
node --version
npm --version
```
You should see version numbers like:
```
v20.11.0
10.2.4
```

---

## 🐍 Step 2: Install Python (Required for AI Service)

### Download & Install:
1. **Go to:** https://www.python.org/downloads/
2. **Download:** Latest Python 3.x (Python 3.12 or 3.11 recommended)
   - Example: `python-3.12.x-amd64.exe`
3. **Run the installer:**
   - ✅ **CRITICAL:** Check "Add Python to PATH" at the bottom!
   - Choose "Install Now" or "Customize installation"
   - If customizing, make sure "pip" is selected
4. **Restart your computer** (or close and reopen PowerShell)

### Verify Installation:
Open a **NEW** PowerShell window and run:
```powershell
python --version
pip --version
```
You should see:
```
Python 3.12.x
pip 24.x.x
```

---

## ✅ Step 3: After Installation

### 1. Close ALL PowerShell/Command Prompt windows
### 2. Open NEW PowerShell windows
### 3. Verify everything works:
```powershell
node --version
npm --version
python --version
pip --version
```

### 4. Then start your project again:
```powershell
# Terminal 1 - Backend
cd "C:\Users\ingol\Downloads\givista (7)\givista (5)\givista (2)\givista\givista\backend"
npm run dev

# Terminal 2 - Frontend
cd "C:\Users\ingol\Downloads\givista (7)\givista (5)\givista (2)\givista\givista\frontend"
npm run dev

# Terminal 3 - AI Service
cd "C:\Users\ingol\Downloads\givista (7)\givista (5)\givista (2)\givista\givista\ai_service"
python app.py
```

---

## 🚨 Common Issues

### "Command not recognized" after installation?
- **Solution:** Restart your computer or close ALL terminal windows and open new ones
- The PATH environment variable updates require a restart

### Node.js installed but npm doesn't work?
- Reinstall Node.js and make sure "npm" is included in the installation

### Python installed but pip doesn't work?
- Reinstall Python and make sure "pip" is checked during installation
- Or run: `python -m ensurepip --upgrade`

### Still having issues?
1. Check if programs are actually installed:
   - Node.js: `C:\Program Files\nodejs\`
   - Python: `C:\Users\YourName\AppData\Local\Programs\Python\` or `C:\Python3xx\`

2. Manually add to PATH (if needed):
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path" → Edit
   - Add Node.js path: `C:\Program Files\nodejs\`
   - Add Python path: `C:\Python3xx\` or wherever Python is installed

---

## 📝 Quick Checklist

- [ ] Node.js LTS downloaded and installed
- [ ] npm works (`npm --version`)
- [ ] Python 3.x downloaded and installed
- [ ] pip works (`pip --version`)
- [ ] Restarted computer or opened new PowerShell windows
- [ ] All commands work in new terminal

---

**After installing both, come back and we'll start the project! 🚀**

