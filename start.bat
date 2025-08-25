@echo off
echo Starting Real Estate Management System...
echo.

echo Starting Server...
start "Server" cmd /k "cd server && npm run dev"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo Starting Client...
start "Client" cmd /k "cd client && npm start"

echo.
echo System is starting...
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
pause
