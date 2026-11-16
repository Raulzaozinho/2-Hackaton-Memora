@echo off
rem Feira Dev: prepara este computador (Node, Java, dependencias) e confere tudo.
rem De dois cliques neste arquivo ou rode .\preparar.cmd no terminal, dentro da pasta do projeto.
chcp 65001 > nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\preparar.ps1"
echo.
pause
