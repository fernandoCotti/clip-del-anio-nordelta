# Quick Fix for Git Lock Issues

The `.git` directory is locked and can't be removed normally. Here are your options:

## Option 1: Run as Administrator (Recommended)

1. **Right-click** on **PowerShell** in the Start menu
2. Select **"Run as Administrator"**
3. Navigate to your project:
   ```powershell
   cd C:\Projects\clip-del-anio-nordelta
   ```
4. Run the fix script:
   ```powershell
   .\fix-git-admin-required.ps1
   ```

This script will:
- Stop processes locking the files
- Remove lock files
- Take ownership of the `.git` directory
- Remove the corrupted `.git` directory
- Initialize a fresh Git repository

## Option 2: Restart Your Computer

Sometimes files remain locked even after pausing OneDrive. A restart will release all locks:

1. **Save all your work**
2. **Restart your computer**
3. After restart, run:
   ```powershell
   cd C:\Projects\clip-del-anio-nordelta
   Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
   git init
   git add .
   git commit -m "Initial commit - Tournament voting app"
   git branch -M main
   ```

## Option 3: Manual Removal via File Explorer

1. Open **File Explorer**
2. Navigate to `C:\Projects\clip-del-anio-nordelta`
3. Enable **"Show hidden files"** (View tab > Hidden items)
4. Try to delete the `.git` folder manually
5. If it says "Access Denied", restart your computer and try again
6. After deletion, run `git init` in PowerShell

## Option 4: Use Git Bash (Alternative)

If you have Git Bash installed:

1. Open **Git Bash** (right-click > Run as Administrator)
2. Navigate to your project:
   ```bash
   cd /c/Projects/clip-del-anio-nordelta
   ```
3. Remove and reinitialize:
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```

---

## After Git is Initialized

Once Git is working, continue with:

1. **Create GitHub repository** (see DEPLOYMENT_GUIDE.md)
2. **Push your code** to GitHub
3. **Deploy to Vercel** (see DEPLOYMENT_GUIDE.md)

---

**Which option should you try?**

- **Option 1** is fastest if you're comfortable running as Administrator
- **Option 2** is safest and most reliable (restart always releases locks)
- **Option 3** is good if you prefer GUI
- **Option 4** works if you have Git Bash installed
