@echo off
rem Feira Dev: liga o projeto para pilotar (back-end, front-end e o painel do reporter).
rem Usa o Node e o Java que o preparar.cmd escolheu. Para encerrar: Ctrl+C.
setlocal
chcp 65001 > nul
if exist "%USERPROFILE%\feira-ferramentas\caminhos.cmd" call "%USERPROFILE%\feira-ferramentas\caminhos.cmd"
cd /d "%~dp0"
node scripts\piloto.mjs
