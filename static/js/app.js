class InsightSphere {
    constructor() {
        this.chart = null;
        this.refreshInterval = null;
        this.isLoading = false;
        this.lastUpdate = null;
        
        this.init();
    }

    init() {
        console.log('InsightSphere 初始化中...');
        this.setupStatusIndicator();
        this.loadInitialData();
        this.startAutoRefresh();
        this.setupEventListeners();
    }

    setupStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'status-indicator';
        indicator.className = 'status-indicator status-loading';
        indicator.textContent = '加载中...';
        document.body.appendChild(indicator);
    }

    updateStatus(status, message) {
        const indicator = document.getElementById('status-indicator');
        if (indicator) {
            indicator.className = `status-indicator status-${status}`;
            indicator.textContent = message;
        }
    }

    setupEventListeners() {
        // 页面可见性变化时的处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoRefresh();
            } else {
                this.startAutoRefresh();
                this.loadInitialData(); // 页面重新可见时刷新数据
            }
        });

        // 网络状态变化
        window.addEventListener('online', () => {
            this.updateStatus('online', '网络已连接');
            this.loadInitialData();
        });

        window.addEventListener('offline', () => {
            this.updateStatus('offline', '网络已断开');
        });
    }

    async loadInitialData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.updateStatus('loading', '加载数据中...');
        
        try {
            const [globalResult, top10Result] = await Promise.all([
                this.fetchGlobalData(),
                this.fetchTop10Data()
            ]);

            if (globalResult.success && top10Result.success) {
                this.renderGlobalData(globalResult.data);
                this.renderTop10Data(top10Result.data);
                this.renderChart(top10Result.data);
                
                this.lastUpdate = new Date();
                this.updateLastUpdatedTime();
                this.updateStatus('online', '数据已更新');
            } else {
                throw new Error('数据获取失败');
            }

        } catch (error) {
            console.error('数据加载失败:', error);
            this.showError('数据加载失败，请稍后重试');
            this.updateStatus('offline', '数据加载失败');
        } finally {
            this.isLoading = false;
        }
    }

    async fetchGlobalData() {
        try {
            const response = await fetch('/api/global');
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || '请求失败');
            }
            
            return result;
        } catch (error) {
            console.error('全球数据获取失败:', error);
            return { success: false, error: error.message };
        }
    }

    async fetchTop10Data() {
        try {
            const response = await fetch('/api/top10');
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || '请求失败');
            }
            
            return result;
        } catch (error) {
            console.error('Top10数据获取失败:', error);
            return { success: false, error: error.message };
        }
    }

    renderGlobalData(data) {
        const container = document.getElementById('global-stats');
        if (!container) return;

        container.innerHTML = `
            <div class="stat-item fade-in">
                <div class="stat-value">$${this.formatNumber(data.total_market_cap_usd)}</div>
                <div class="stat-label">总市值</div>
            </div>
            <div class="stat-item fade-in">
                <div class="stat-value">$${this.formatNumber(data.total_volume_24h_usd)}</div>
                <div class="stat-label">24小时交易量</div>
            </div>
            <div class="stat-item fade-in">
                <div class="stat-value">${data.bitcoin_dominance.toFixed(1)}%</div>
                <div class="stat-label">BTC市值占比</div>
            </div>
            <div class="stat-item fade-in">
                <div class="stat-value">${data.ethereum_dominance.toFixed(1)}%</div>
                <div class="stat-label">ETH市值占比</div>
            </div>
            <div class="stat-item fade-in">
                <div class="stat-value">${this.formatNumber(data.active_cryptocurrencies)}</div>
                <div class="stat-label">活跃加密货币</div>
            </div>
            <div class="stat-item fade-in">
                <div class="stat-value">${this.formatNumber(data.markets)}</div>
                <div class="stat-label">交易市场</div>
            </div>
        `;
    }

    renderTop10Data(data) {
        const tbody = document.getElementById('crypto-tbody');
        if (!tbody || !data || !Array.isArray(data)) return;

        tbody.innerHTML = data.map(coin => `
            <tr class="fade-in">
                <td>
                    <span class="rank-badge">${coin.rank}</span>
                </td>
                <td>
                    <div class="coin-info">
                        <img src="${coin.image}" alt="${coin.name}" class="coin-logo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNjY2MiLz4KPHRleHQgeD0iMTUiIHk9IjE5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4K'">
                        <div>
                            <div class="coin-name">${coin.name}</div>
                            <div class="coin-symbol">${coin.symbol}</div>
                        </div>
                    </div>
                </td>
                <td class="font-weight-bold">$${this.formatPrice(coin.current_price)}</td>
                <td class="price-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                    ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>$${this.formatNumber(coin.market_cap)}</td>
                <td>$${this.formatNumber(coin.total_volume)}</td>
            </tr>
        `).join('');
    }

    renderChart(data) {
        if (!data || !Array.isArray(data)) return;

        const ctx = document.getElementById('marketCapChart');
        if (!ctx) return;

        // 销毁现有图表
        if (this.chart) {
            this.chart.destroy();
        }

        // 准备图表数据
        const chartData = data.map(coin => ({
            label: coin.symbol,
            value: coin.market_cap,
            color: this.generateColor(coin.rank - 1)
        }));

        // 创建新图表
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.map(item => item.label),
                datasets: [{
                    data: chartData.map(item => item.value),
                    backgroundColor: chartData.map(item => item.color),
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverBorderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: $${this.formatNumber(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    }

    generateColor(index) {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#4BC0C0', '#FF6384'
        ];
        return colors[index % colors.length];
    }

    formatNumber(num) {
        if (num >= 1e12) {
            return (num / 1e12).toFixed(1) + 'T';
        }
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    formatPrice(price) {
        if (price >= 1) {
            return price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return price.toPrecision(4);
    }

    showError(message) {
        // 移除现有错误消息
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // 创建新的错误消息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message fade-in';
        errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <span>${message}</span>
        `;

        // 插入到页面顶部
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }

        // 5秒后自动移除
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    updateLastUpdatedTime() {
        const element = document.getElementById('last-updated');
        if (element && this.lastUpdate) {
            element.textContent = `最后更新: ${this.lastUpdate.toLocaleString('zh-CN')}`;
        }
    }

    startAutoRefresh() {
        // 清除现有定时器
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // 设置60秒刷新间隔
        this.refreshInterval = setInterval(() => {
            console.log('自动刷新数据...');
            this.loadInitialData();
        }, 60000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // 手动刷新方法
    refresh() {
        this.loadInitialData();
    }

    // 销毁实例
    destroy() {
        this.stopAutoRefresh();
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，初始化InsightSphere...');
    window.insightSphere = new InsightSphere();
    
    // 添加全局刷新按钮功能
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            window.insightSphere.refresh();
        });
    }
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.insightSphere) {
        window.insightSphere.destroy();
    }
});
