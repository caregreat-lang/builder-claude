@echo off
title Builder Claude (phone access)
cd /d "%~dp0"
echo If Windows asks whether Node.js may use the network, allow "Private networks" only.
start "" http://localhost:8787
node server.js --lan
pause
