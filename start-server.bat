@echo off
echo ========================================
echo   Interview Score Card - Web Server
echo ========================================
echo.
echo Starting local web server on port 8000...
echo.
echo The application will be available at:
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    echo.
    pause
    exit /b 1
)

REM Start the web server
python -m http.server 8000

echo.
echo Server stopped.
pause
