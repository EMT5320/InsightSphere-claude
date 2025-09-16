from flask import Flask, render_template, jsonify
from flask_cors import CORS
import requests
import json
import time
import logging
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# 简化版内存缓存
memory_cache = {}

# API配置
COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"
CACHE_DURATION = 30
REQUEST_TIMEOUT = 10

def get_cached_data(key):
    """获取缓存数据"""
    if key in memory_cache:
        cached_item = memory_cache[key]
        if time.time() - cached_item['timestamp'] < CACHE_DURATION:
            return cached_item['data']
        else:
            del memory_cache[key]
    return None

def set_cached_data(key, data):
    """设置缓存数据"""
    memory_cache[key] = {
        'data': data,
        'timestamp': time.time()
    }

def make_api_request(endpoint, params=None):
    """统一的API请求函数"""
    url = f"{COINGECKO_BASE_URL}/{endpoint}"
    cache_key = f"coingecko:{endpoint}"
    
    # 尝试从缓存获取数据
    cached_data = get_cached_data(cache_key)
    if cached_data:
        logger.info(f"从缓存返回数据: {endpoint}")
        return {"success": True, "data": cached_data}
    
    try:
        logger.info(f"发起API请求: {endpoint}")
        response = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        
        data = response.json()
        
        # 缓存响应数据
        set_cached_data(cache_key, data)
        
        return {"success": True, "data": data}
        
    except Exception as e:
        logger.error(f"API请求失败 {endpoint}: {e}")
        return {"success": False, "error": f"API请求失败: {str(e)}"}

@app.route('/')
def index():
    """主页"""
    return render_template('index.html')

@app.route('/api/global')
def get_global_data():
    """获取全球市场数据"""
    result = make_api_request("global")
    
    if result["success"]:
        global_data = result["data"]
        
        try:
            processed_data = {
                "total_market_cap_usd": global_data["data"]["total_market_cap"]["usd"],
                "total_volume_24h_usd": global_data["data"]["total_volume"]["usd"],
                "bitcoin_dominance": global_data["data"]["market_cap_percentage"]["btc"],
                "ethereum_dominance": global_data["data"]["market_cap_percentage"]["eth"],
                "active_cryptocurrencies": global_data["data"]["active_cryptocurrencies"],
                "markets": global_data["data"]["markets"],
                "last_updated": datetime.now().isoformat()
            }
            
            return jsonify({
                "success": True,
                "data": processed_data
            })
            
        except KeyError as e:
            logger.error(f"数据格式错误: {e}")
            return jsonify({
                "success": False,
                "error": "数据格式异常，请稍后重试"
            }), 400
    else:
        return jsonify({
            "success": False,
            "error": result["error"]
        }), 500

@app.route('/api/top10')
def get_top10_data():
    """获取前10名加密货币数据"""
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 10,
        "page": 1,
        "sparkline": False,
        "price_change_percentage": "24h"
    }
    
    result = make_api_request("coins/markets", params)
    
    if result["success"]:
        coins_data = result["data"]
        
        try:
            processed_data = []
            for i, coin in enumerate(coins_data, 1):
                processed_data.append({
                    "rank": i,
                    "id": coin["id"],
                    "symbol": coin["symbol"].upper(),
                    "name": coin["name"],
                    "image": coin["image"],
                    "current_price": coin["current_price"],
                    "market_cap": coin["market_cap"],
                    "market_cap_rank": coin["market_cap_rank"],
                    "price_change_percentage_24h": coin.get("price_change_percentage_24h", 0),
                    "total_volume": coin["total_volume"],
                    "last_updated": coin["last_updated"]
                })
            
            return jsonify({
                "success": True,
                "data": processed_data,
                "last_updated": datetime.now().isoformat()
            })
            
        except KeyError as e:
            logger.error(f"数据格式错误: {e}")
            return jsonify({
                "success": False,
                "error": "数据格式异常，请稍后重试"
            }), 400
    else:
        return jsonify({
            "success": False,
            "error": result["error"]
        }), 500

@app.route('/api/status')
def get_status():
    """获取服务状态"""
    return jsonify({
        "status": "running",
        "cache_type": "memory",
        "timestamp": datetime.now().isoformat(),
        "cache_duration": CACHE_DURATION
    })

if __name__ == '__main__':
    logger.info("启动 InsightSphere 服务...")
    app.run(host='0.0.0.0', port=8737, debug=True)
