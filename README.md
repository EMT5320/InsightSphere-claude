# 🌐 InsightSphere
### 实时加密货币数据可视化仪表盘

![GitHub last commit](https://img.shields.io/github/last-commit/EMT5320/InsightSphere-claude)
![GitHub repo size](https://img.shields.io/github/repo-size/EMT5320/InsightSphere-claude)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/flask-2.3+-green.svg)
![Docker](https://img.shields.io/badge/docker-supported-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> 🚀 一个现代化的加密货币数据可视化平台，提供实时市场数据、交互式图表和直观的用户界面。

## 项目简介

InsightSphere 是一个实时、交互式的加密货币数据可视化仪表盘。它从 CoinGecko API 获取全球市场数据和排名前10的加密货币信息，通过直观的图表和表格展示给用户。

## 技术选型及理由

### 后端技术栈
- **Flask (Python)**: 轻量级Web框架，开发快速，部署简单
- **Redis**: 高性能内存数据库，用于API响应缓存，有效控制请求频率
- **Requests**: 处理HTTP请求，与CoinGecko API交互
- **APScheduler**: 后台定时任务调度，实现数据定期更新

### 前端技术栈
- **HTML5 + CSS3 + Vanilla JavaScript**: 无需复杂框架，降低依赖，提高性能
- **Chart.js**: 功能强大的图表库，支持响应式设计和交互效果
- **Bootstrap**: CSS框架，确保响应式布局和良好的移动端体验

### 容器化
- **Docker**: 环境一致性，简化部署流程
- **Docker Compose**: 多服务编排，一键启动整个应用栈

### 架构优势
1. **缓存策略**: 使用Redis缓存API响应30秒，避免频繁请求导致封IP
2. **错误处理**: 完善的异常处理机制，API失败时提供友好的用户提示
3. **响应式设计**: 适配桌面和移动设备
4. **实时更新**: 前端每60秒自动刷新数据

## 本地环境搭建指南

### 方法一：Docker Compose (推荐)

1. **克隆或下载项目代码**
   ```bash
   cd D:\Work\arena\web_demo\claude
   ```

2. **启动服务**
   ```bash
   docker-compose up --build
   ```

3. **访问应用**
   - 打开浏览器访问: http://localhost:8737

### 方法二：本地开发环境

#### 前置要求
- Python 3.8+
- Redis Server
- Node.js (可选，用于前端开发)

#### 安装步骤

1. **安装Python依赖**
   ```bash
   pip install -r requirements.txt
   ```

2. **启动Redis服务**
   - Windows: 下载并启动Redis服务器
   - Linux/Mac: `redis-server`

3. **设置环境变量** (可选)
   ```bash
   export FLASK_ENV=development
   export REDIS_URL=redis://localhost:6379
   ```

4. **启动后端服务**
   ```bash
   python app.py
   ```

5. **访问应用**
   - 打开浏览器访问: http://localhost:8737

## API 端点

- `GET /api/global` - 获取全球市场概览数据
- `GET /api/top10` - 获取市值排名前10的加密货币数据
- `GET /` - 前端页面

## 功能特性

### 数据展示
- **全球市场概览**: 总市值、24小时交易量、比特币市值占比
- **Top 10 排行榜**: 实时价格、涨跌幅、市值数据表格
- **市值分布图**: 交互式饼图展示各币种市值占比

### 技术特性
- **智能缓存**: 30秒缓存期，平衡实时性与API限制
- **错误恢复**: API失败时显示友好提示，不影响页面运行
- **响应式设计**: 自适应桌面和移动设备
- **实时更新**: 60秒自动刷新数据

## 项目结构

```
InsightSphere/
├── app.py              # Flask后端主程序
├── requirements.txt    # Python依赖
├── Dockerfile         # Docker构建文件
├── docker-compose.yml # Docker编排文件
├── static/            # 静态资源
│   ├── css/
│   ├── js/
│   └── images/
├── templates/         # HTML模板
│   └── index.html
└── README.md         # 项目文档
```

## 开发说明

### 缓存策略
- API响应缓存30秒，减少对CoinGecko的请求频率
- 前端每60秒刷新，确保数据相对实时

### 错误处理
- API请求超时处理 (10秒超时)
- 网络错误友好提示
- 数据格式异常处理

### 安全考虑
- 无硬编码敏感信息
- CORS配置适当限制
- 输入验证和输出转义

## 故障排除

### 常见问题
1. **Redis连接失败**: 确保Redis服务正在运行
2. **端口占用**: 检查8737端口是否被占用
3. **API请求失败**: 检查网络连接和CoinGecko API状态

### 日志查看
```bash
docker-compose logs -f
```

## 许可证

MIT License
