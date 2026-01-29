@echo off

echo ======================================================
echo    GhostPassV8 - Starting Application
echo ======================================================
echo.

:: Check if node_modules exists
if not exist node_modules (
    echo [!] node_modules not found. Running installer first...
    call install.bat
    if %ERRORLEVEL% NEQ 0 exit /b 1
)

echo [+] Starting Development Server...
echo Site will be available at: http://localhost:3000
echo.

call npm run dev

pause
