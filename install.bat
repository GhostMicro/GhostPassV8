@echo off
SETLOCAL EnableDelayedExpansion

echo ======================================================
echo    GhostPassV8 Installer - Quick Setup
echo ======================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js not found. Attempting to install via winget...
    echo.
    winget --version >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Winget is not installed. 
        echo Please install Node.js manually from: https://nodejs.org/
        pause
        exit /b 1
    )
    
    echo [Step 1] Installing Node.js (LTS version)...
    winget install OpenJS.NodeJS.LTS
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Installation failed. Please run this as Administrator or install Node.js manually.
        pause
        exit /b 1
    )
    echo.
    echo [+] Node.js installed successfully. 
    echo Please RESTART this script to continue.
    pause
    exit /b 0
) else (
    echo [+] Node.js is already installed.
)

:: Check for environment variables
if not exist .env.local (
    echo [Step 2] Creating .env.local from backup...
    if exist env-master.txt (
        copy env-master.txt .env.local
    ) else (
        echo [WARNING] env-master.txt not found. Creating empty .env.local
        echo # GhostPass Config > .env.local
    )
)

:: Install dependencies
echo [Step 3] Installing project dependencies (npm install)...
echo This may take a few minutes depending on your internet speed.
echo.
call npm install --force

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] npm install failed. 
    pause
    exit /b 1
)

echo.
echo ======================================================
echo    INSTALLATION COMPLETE!
echo ======================================================
echo.
echo You can now use "start.bat" to run the application.
echo.
pause
