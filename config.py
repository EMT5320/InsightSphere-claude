import os

class Config:
    """基础配置类"""
    # Flask配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'insightsphere-dev-key-change-in-production'
    
    # Redis配置
    REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))
    REDIS_DB = int(os.environ.get('REDIS_DB', 0))
    REDIS_TIMEOUT = int(os.environ.get('REDIS_TIMEOUT', 5))
    
    # API配置
    COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'
    API_TIMEOUT = int(os.environ.get('API_TIMEOUT', 10))
    CACHE_DURATION = int(os.environ.get('CACHE_DURATION', 30))
    PRELOAD_INTERVAL = int(os.environ.get('PRELOAD_INTERVAL', 25))
    
    # 应用配置
    PORT = int(os.environ.get('PORT', 8737))
    HOST = os.environ.get('HOST', '0.0.0.0')

class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True
    FLASK_ENV = 'development'
    REDIS_HOST = 'localhost'

class ProductionConfig(Config):
    """生产环境配置"""
    DEBUG = False
    FLASK_ENV = 'production'
    REDIS_HOST = 'redis'  # Docker service name

class TestingConfig(Config):
    """测试环境配置"""
    TESTING = True
    CACHE_DURATION = 5  # 更短的缓存时间用于测试

# 配置映射
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
