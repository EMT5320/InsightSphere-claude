# 📊 InsightSphere - 加密货币数据可视化仪表盘

## 🎯 项目概览

InsightSphere 是一个功能完整、实时更新的加密货币数据可视化仪表盘。它从 CoinGecko API 获取数据，通过直观的界面展示全球市场概览、Top 10 排行榜和交互式图表。

### ✨ 核心特性

- 🌍 **全球市场概览**: 实时显示总市值、交易量、比特币和以太坊市值占比
- 🏆 **Top 10 排行榜**: 市值前10的加密货币详细信息
- 📈 **交互式图表**: 市值分布饼图，支持悬停查看详情
- ⚡ **实时更新**: 60秒自动刷新，30秒智能缓存
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🚀 **一键部署**: Docker Compose 支持

## 🛠️ 技术栈

| 层级 | 技术选择 | 理由 |
|------|----------|------|
| **后端** | Flask (Python) | 轻量级，快速开发 |
| **缓存** | Redis | 高性能，避免API限制 |
| **前端** | Vanilla JavaScript + Chart.js | 简单高效，无复杂依赖 |
| **样式** | CSS3 + 响应式设计 | 现代UI，良好兼容性 |
| **容器化** | Docker + Docker Compose | 环境一致，简化部署 |

## 🚀 快速开始

### 方法一：Docker (推荐)

```bash
# 1. 进入项目目录
cd D:\Work\arena\web_demo\claude

# 2. 一键启动
docker-compose up --build

# 3. 访问应用
http://localhost:8737
```

### 方法二：本地开发

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 启动应用
python app.py

# 3. 访问应用
http://localhost:8737
```

## 📁 项目结构

```
InsightSphere/
├── app.py                 # Flask 主应用
├── config.py              # 配置管理
├── requirements.txt       # Python 依赖
├── Dockerfile            # Docker 构建
├── docker-compose.yml    # 容器编排
├── static/               # 静态资源
│   ├── css/style.css    # 样式文件
│   └── js/app.js        # 前端逻辑
├── templates/
│   └── index.html       # 主页模板
├── test_api.py          # API 测试工具
├── setup.bat           # Windows 安装脚本
├── start.bat           # Docker 启动脚本
├── start-local.bat     # 本地启动脚本
└── README.md           # 详细文档
```

## 🎨 界面预览

### 桌面端
- 🌍 全球市场数据卡片，包含6个关键指标
- 📊 Top 10 加密货币表格，含价格变化色彩区分
- 🥧 市值分布交互式饼图

### 移动端
- 📱 自适应布局，保持良好可读性
- 👆 触摸友好的交互体验
- 🔄 优化的刷新机制

## ⚡ 性能特性

### 智能缓存
- **API 缓存**: 30秒有效期，减少外部请求
- **预加载机制**: 25秒间隔预热热门数据
- **故障转移**: Redis 不可用时自动使用内存缓存

### 错误处理
- **网络容错**: API 请求失败时友好提示
- **优雅降级**: 部分功能失效不影响整体使用
- **自动恢复**: 网络恢复后自动重新请求数据

## 🔧 配置选项

### 环境变量
```bash
FLASK_ENV=production        # 运行环境
REDIS_HOST=redis           # Redis 主机
REDIS_PORT=6379           # Redis 端口
CACHE_DURATION=30         # 缓存时长(秒)
API_TIMEOUT=10            # API 超时(秒)
PORT=8737                 # 应用端口
```

## 📊 API 端点

| 端点 | 描述 | 缓存 |
|------|------|------|
| `GET /` | 主页面 | - |
| `GET /api/global` | 全球市场数据 | 30s |
| `GET /api/top10` | Top10 货币数据 | 30s |
| `GET /api/status` | 系统状态 | - |

## 🧪 测试

```bash
# API 测试
python test_api.py

# Docker 健康检查
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 🔍 监控

### 应用监控
- ✅ 健康检查端点 (`/api/status`)
- 📝 结构化日志记录
- 🚨 自动故障检测

### 系统监控
- 🐳 Docker 容器状态
- 💾 Redis 连接状态
- 🌐 CoinGecko API 可用性

## 🛡️ 安全考虑

- 🔒 非 root 用户运行容器
- 🌐 适当的 CORS 配置
- 🚫 无敏感信息硬编码
- 🔄 输入验证和输出转义

## 🚀 部署建议

### 生产环境
1. 使用反向代理 (Nginx)
2. 启用 HTTPS
3. 配置日志轮转
4. 监控资源使用

### 扩展性
- 水平扩展：多个应用实例
- 缓存优化：Redis 集群
- CDN：静态资源加速

## 📚 开发指南

详细的开发文档请参考：
- [`README.md`](README.md) - 完整使用说明
- [`DEVELOPMENT.md`](DEVELOPMENT.md) - 开发者指南

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

**🌟 InsightSphere - 让加密货币数据触手可及！**
