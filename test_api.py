import requests
import time
import json

def test_api_endpoints():
    """测试API端点"""
    base_url = "http://localhost:8737"
    
    endpoints = [
        "/api/status",
        "/api/global", 
        "/api/top10"
    ]
    
    print("=== InsightSphere API 测试 ===\n")
    
    for endpoint in endpoints:
        print(f"测试 {endpoint}...")
        try:
            start_time = time.time()
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            end_time = time.time()
            
            print(f"状态码: {response.status_code}")
            print(f"响应时间: {(end_time - start_time)*1000:.2f}ms")
            
            if response.status_code == 200:
                data = response.json()
                if 'success' in data:
                    print(f"Success: {data['success']}")
                    if data['success']:
                        print("✅ 测试通过")
                    else:
                        print(f"❌ API返回错误: {data.get('error', 'Unknown error')}")
                else:
                    print("✅ 状态端点正常")
            else:
                print(f"❌ HTTP错误: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ 请求失败: {e}")
        
        print("-" * 50)
        time.sleep(1)

def test_frontend():
    """测试前端页面"""
    print("=== 前端页面测试 ===\n")
    
    try:
        response = requests.get("http://localhost:8737/", timeout=10)
        print(f"前端页面状态码: {response.status_code}")
        
        if response.status_code == 200:
            if "InsightSphere" in response.text:
                print("✅ 前端页面加载正常")
            else:
                print("❌ 前端页面内容异常")
        else:
            print(f"❌ 前端页面HTTP错误: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 前端页面请求失败: {e}")

if __name__ == "__main__":
    print("InsightSphere 测试工具")
    print("请确保应用正在运行在 http://localhost:8737")
    print()
    
    input("按回车键开始测试...")
    
    test_frontend()
    print()
    test_api_endpoints()
    
    print("\n测试完成！")
    input("按回车键退出...")
