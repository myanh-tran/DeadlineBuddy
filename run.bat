@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "Deadline Buddy" http://localhost:8000
  py sync_server.py
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "Deadline Buddy" http://localhost:8000
    python sync_server.py
  ) else (
    echo Python chua duoc cai dat. Cai Python 3 roi chay lai run.bat.
    pause
  )
)
