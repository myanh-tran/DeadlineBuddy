@echo off
cd /d "%~dp0"

netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if errorlevel 1 (
  where py >nul 2>nul
  if %errorlevel%==0 (
    start "Deadline Buddy" /min py sync_server.py
  ) else (
    start "Deadline Buddy" /min python sync_server.py
  )
  timeout /t 2 /nobreak >nul
)

set "URL=http://localhost:8000"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" --app=%URL%
) else (
  start "" "%URL%"
)
