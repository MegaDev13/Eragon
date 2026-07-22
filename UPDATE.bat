```bat
@echo off
title Eragon - Upload Automático para GitHub
color 0A

echo ==========================================
echo      ERAGON - GITHUB AUTO PUSH
echo ==========================================
echo.

REM Verifica se existe um repositório Git
if not exist ".git" (
    echo [ERRO] Esta pasta nao e um repositorio Git.
    pause
    exit /b
)

echo.
echo [1/6] Atualizando repositorio...
git fetch origin

echo.
echo [2/6] Adicionando todos os arquivos...
git add .

echo.
set /p MSG=Digite a mensagem do commit (pressione ENTER para usar "Atualizacao do projeto"): 

if "%MSG%"=="" set MSG=Atualizacao do projeto

echo.
echo [3/6] Criando commit...
git commit -m "%MSG%"

echo.
echo [4/6] Enviando para o GitHub...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tentando enviar para a branch master...
    git push origin master
)

echo.
echo ==========================================
echo Processo concluido.
echo ==========================================
echo.

pause
```
