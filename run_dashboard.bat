@echo off
chcp 65001 >nul
title Aegis 工業 AI 監控儀表板啟動器

echo ==================================================
echo   Aegis Industrial AI Dashboard Local Server
echo ==================================================
echo.
echo [1/2] 正在為您開啟瀏覽器頁面 (http://localhost:8000) ...
start http://localhost:8000
echo.
echo [2/2] 正在啟動 Python 本地網頁伺服器 (連接埠 8000) ...
echo.
echo --------------------------------------------------
echo   提示：請勿關閉此視窗！關閉此視窗將會關閉儀表板。
echo --------------------------------------------------
echo.
python -m http.server 8000
if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 無法啟動 Python 伺服器，請確認您的電腦是否已安裝 Python。
    pause
)
