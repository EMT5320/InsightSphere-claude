@echo off
echo Starting InsightSphere Application...
echo.

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH
    echo Please install Docker Desktop for Windows
    pause
    exit /b 1
)

REM 检查Docker是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running
    echo Please start Docker Desktop
    pause
    exit /b 1
)

echo Building and starting services...
docker-compose up --build

pause
