@echo off
title BotHub Firebase Setup
color 0A
cls

echo.
echo  ==========================================================
echo    BOTHUB - Firebase Hosting Setup
echo  ==========================================================
echo.
echo  Schritt 1: Firebase Login (Browser oeffnet sich)
echo.
call firebase login
if %errorlevel% neq 0 (
    echo  FEHLER beim Login!
    pause
    exit /b 1
)

echo.
echo  ==========================================================
echo  Schritt 2: Firebase Projekt erstellen / auswaehlen
echo  ==========================================================
echo.
echo  Erstelle neues Firebase-Projekt fuer BotHub...
call firebase projects:create bothub-landing-2026 --display-name "BotHub Landing" 2>nul
if %errorlevel% neq 0 (
    echo  Projekt existiert eventuell schon - fahre fort...
)

echo.
echo  ==========================================================
echo  Schritt 3: Hosting initialisieren
echo  ==========================================================
echo.

REM Create .firebaserc
echo { > .firebaserc
echo   "projects": { >> .firebaserc
echo     "default": "bothub-landing-2026" >> .firebaserc
echo   } >> .firebaserc
echo } >> .firebaserc

echo  .firebaserc erstellt.

echo.
echo  ==========================================================
echo  Schritt 4: DEPLOY!
echo  ==========================================================
echo.
call firebase deploy --only hosting

echo.
if %errorlevel% eq 0 (
    echo  SUCCESS! BotHub Landing ist LIVE!
    echo.
    echo  Deine URL: https://bothub-landing-2026.web.app
) else (
    echo  Deploy fehlgeschlagen - bitte Fehler pruefen
)

echo.
pause
