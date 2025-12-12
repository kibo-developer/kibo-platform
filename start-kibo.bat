@echo off
TITLE Kibo Platform Launcher 🚀
CLS
echo ==================================================
echo   KIBO PLATFORM: MASTER BOOT SEQUENCE
echo ==================================================
echo.
echo [1/3] STOPPING OLD GHOST PROCESSES...
taskkill /F /IM node.exe >nul 2>&1
echo       > Clean.
echo.

echo [2/3] STARTING API (CEREBRO) - Port 3001
echo       > Spawning separate window...
start "KIBO API (Backend)" /B powershell -NoExit -Command "pnpm --filter @kibo/api start:dev"

echo.
echo       > Waiting 8 seconds for API initialization...
timeout /t 8 /nobreak >nul

echo.
echo [3/3] STARTING WEB (CARA) - Port 3000
echo       > Spawning separate window...
start "KIBO WEB (Frontend)" /B powershell -NoExit -Command "pnpm --filter @kibo/web dev"

echo.
echo ==================================================
echo   SYSTEM ONLINE
echo ==================================================
echo   API Status: http://localhost:3001/users (Expect JSON)
echo   Web Status: http://localhost:3000 (Expect UI)
echo.
echo   You may minimize this window.
pause
