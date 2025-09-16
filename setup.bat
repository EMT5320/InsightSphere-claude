@echo off
title InsightSphere - Complete Setup and Test

echo ============================================
echo     InsightSphere Setup and Test Tool
echo ============================================
echo.

:menu
echo 请选择操作:
echo 1. Docker 方式启动 (推荐)
echo 2. 本地开发方式启动
echo 3. 测试API接口
echo 4. 查看Docker日志
echo 5. 停止所有服务
echo 6. 清理Docker资源
echo 0. 退出
echo.
set /p choice="请输入选择 (0-6): "

if "%choice%"=="1" goto docker_start
if "%choice%"=="2" goto local_start
if "%choice%"=="3" goto test_api
if "%choice%"=="4" goto docker_logs
if "%choice%"=="5" goto stop_services
if "%choice%"=="6" goto cleanup_docker
if "%choice%"=="0" goto end
goto invalid_choice

:docker_start
echo.
echo 正在使用Docker启动InsightSphere...
echo.
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker未安装或未添加到PATH
    echo 请安装Docker Desktop for Windows
    pause
    goto menu
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker未运行
    echo 请启动Docker Desktop
    pause
    goto menu
)

echo ✅ Docker检查通过
echo 🚀 构建并启动服务...
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ✅ 服务启动成功!
    echo 🌐 应用地址: http://localhost:8737
    echo 📊 Redis管理: http://localhost:6379
    echo.
    echo 等待服务完全就绪...
    timeout /t 10 /nobreak
    start http://localhost:8737
) else (
    echo ❌ 服务启动失败
)
pause
goto menu

:local_start
echo.
echo 正在本地启动InsightSphere...
echo ⚠️  注意: 需要本地Redis服务或使用内存缓存
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python未安装或未添加到PATH
    pause
    goto menu
)

echo ✅ Python检查通过
echo 📦 安装依赖...
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo ✅ 依赖安装成功
    echo 🚀 启动应用...
    set FLASK_ENV=development
    set REDIS_HOST=localhost
    start http://localhost:8737
    python app.py
) else (
    echo ❌ 依赖安装失败
)
pause
goto menu

:test_api
echo.
echo 🧪 测试API接口...
echo.
python test_api.py
pause
goto menu

:docker_logs
echo.
echo 📝 查看Docker服务日志...
echo.
docker-compose logs --tail=50 -f
pause
goto menu

:stop_services
echo.
echo 🛑 停止所有服务...
docker-compose down
if %errorlevel% equ 0 (
    echo ✅ 服务已停止
) else (
    echo ❌ 停止服务时出错
)
pause
goto menu

:cleanup_docker
echo.
echo 🧹 清理Docker资源...
echo 这将删除容器、镜像和数据卷
set /p confirm="确认清理? (y/N): "
if /i "%confirm%"=="y" (
    docker-compose down -v --rmi all
    echo ✅ Docker资源已清理
) else (
    echo 取消清理操作
)
pause
goto menu

:invalid_choice
echo.
echo ❌ 无效选择，请重新输入
pause
goto menu

:end
echo.
echo 👋 感谢使用 InsightSphere!
echo.
pause
