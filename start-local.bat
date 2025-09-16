@echo off
echo Starting InsightSphere (Local Development)...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM 检查是否在虚拟环境中
if not defined VIRTUAL_ENV (
    echo Warning: Not in a virtual environment
    echo It's recommended to use a virtual environment
    echo.
)

REM 安装依赖
echo Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

REM 设置环境变量
set FLASK_ENV=development
set REDIS_HOST=localhost

echo.
echo Starting application...
echo Open http://localhost:8737 in your browser
echo Press Ctrl+C to stop the server
echo.

python app.py
