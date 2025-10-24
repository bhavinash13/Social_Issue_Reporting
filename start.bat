@echo off
echo Starting Social Issues Platform...
echo.

echo Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\client
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete! 
echo.
echo To start the application:
echo 1. Backend: cd server && npm run dev
echo 2. Frontend: cd client && npm run dev
echo.
echo Demo accounts:
echo - User: user@demo.com / demo123
echo - Admin: admin@demo.com / demo123
echo.
pause