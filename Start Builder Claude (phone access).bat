@echo off
title W2G Builder Claude (phone access)
cd /d "%~dp0"
echo If Windows asks whether Node.js may use the network, allow "Private networks" only.
node server.js --lan --open
pause
