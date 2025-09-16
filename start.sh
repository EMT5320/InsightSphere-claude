#!/bin/bash

echo "Starting InsightSphere Application..."
echo

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    echo "Please install Docker first"
    exit 1
fi

# 检查Docker是否运行
if ! docker info &> /dev/null; then
    echo "Error: Docker is not running"
    echo "Please start Docker service"
    exit 1
fi

echo "Building and starting services..."
docker-compose up --build
