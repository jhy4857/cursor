// 数据集详情页面功能

class DatasetDetailPage {
    constructor() {
        this.dataset = null;
        this.currentChart = 'pca';
        this.chartData = null;
        
        this.init();
    }

    init() {
        this.loadDataset();
        this.setupEventListeners();
        this.loadRelatedDatasets();
    }

    loadDataset() {
        const urlParams = new URLSearchParams(window.location.search);
        const datasetId = urlParams.get('id');
        
        if (!datasetId) {
            this.showError('未找到数据集ID');
            return;
        }

        this.dataset = mockDatasets.find(d => d.id === parseInt(datasetId));
        
        if (!this.dataset) {
            this.showError('数据集不存在');
            return;
        }

        this.renderDatasetInfo();
        this.loadChart();
        this.loadMetadata();
    }

    renderDatasetInfo() {
        // 更新页面标题
        document.title = `${this.dataset.title} - 单细胞组学数据集平台`;
        
        // 更新面包屑
        const breadcrumbTitle = document.getElementById('breadcrumbTitle');
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = this.dataset.title;
        }

        // 更新数据集标题
        const titleElement = document.getElementById('datasetTitle');
        if (titleElement) {
            titleElement.textContent = this.dataset.title;
        }

        // 更新作者和年份
        const authorElement = document.getElementById('datasetAuthor');
        if (authorElement) {
            authorElement.textContent = this.dataset.author;
        }

        const yearElement = document.getElementById('datasetYear');
        if (yearElement) {
            yearElement.textContent = this.dataset.year;
        }

        // 更新状态徽章
        const statusElement = document.getElementById('datasetStatus');
        if (statusElement) {
            statusElement.textContent = this.dataset.status;
            statusElement.className = `status-badge status-${this.dataset.status.replace('已', '').replace('中', '').replace('未', 'not-')}`;
        }

        // 更新文献信息
        this.updateElement('journal', this.dataset.journal);
        this.updateElement('doiLink', this.dataset.doi, 'href', `https://doi.org/${this.dataset.doi}`);
        this.updateElement('publishDate', utils.formatDate(this.dataset.publishDate));
        this.updateElement('citationCount', this.dataset.citationCount);

        // 更新数据源信息
        this.updateElement('species', this.dataset.species);
        this.updateElement('platform', this.dataset.platform);
        this.updateElement('sampleCount', utils.formatNumber(this.dataset.samples));
        this.updateElement('cellCount', utils.formatNumber(this.dataset.cells));
        this.updateElement('dataLink', '访问数据', 'href', this.dataset.dataLink);

        // 更新复现信息
        this.updateElement('reproStatus', this.dataset.status);
        this.updateElement('codeLink', '查看代码', 'href', this.dataset.codeLink);
        this.updateElement('envRequirements', this.dataset.envRequirements);
        this.updateElement('reproTime', `${this.dataset.reproTime} 小时`);
    }

    updateElement(id, text, attribute = null, attributeValue = null) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
            if (attribute && attributeValue) {
                element.setAttribute(attribute, attributeValue);
            }
        }
    }

    setupEventListeners() {
        // 图表标签切换
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const chartType = e.target.getAttribute('data-chart');
                this.switchChart(chartType);
            });
        });

        // 图表选项
        const colorBySelect = document.getElementById('colorBy');
        if (colorBySelect) {
            colorBySelect.addEventListener('change', () => {
                this.updateChart();
            });
        }

        const pointSizeRange = document.getElementById('pointSize');
        if (pointSizeRange) {
            pointSizeRange.addEventListener('input', () => {
                this.updateChart();
            });
        }

        // 下载按钮
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.getAttribute('data-format');
                this.downloadChart(format);
            });
        });

        // 分享按钮
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareDataset();
            });
        }

        // 下载数据按钮
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadDataset();
            });
        }
    }

    switchChart(chartType) {
        // 更新标签状态
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');

        this.currentChart = chartType;
        this.loadChart();
    }

    loadChart() {
        const chartArea = document.getElementById('chartArea');
        const chartLoading = document.getElementById('chartLoading');
        
        if (!chartArea || !chartLoading) return;

        // 显示加载状态
        chartLoading.style.display = 'block';
        chartArea.innerHTML = '';

        // 模拟数据加载
        setTimeout(() => {
            this.generateChartData();
            this.renderChart();
            chartLoading.style.display = 'none';
        }, 1000);
    }

    generateChartData() {
        const colorBy = document.getElementById('colorBy').value;
        const pointSize = parseInt(document.getElementById('pointSize').value);

        // 生成模拟数据
        const nPoints = 2000;
        const data = [];

        for (let i = 0; i < nPoints; i++) {
            data.push({
                x: Math.random() * 10 - 5,
                y: Math.random() * 10 - 5,
                z: Math.random() * 10 - 5,
                cell_type: ['T细胞', 'B细胞', 'NK细胞', '单核细胞', '树突细胞'][Math.floor(Math.random() * 5)],
                sample: `Sample_${Math.floor(Math.random() * 8) + 1}`,
                cluster: `Cluster_${Math.floor(Math.random() * 10) + 1}`,
                expression: Math.random() * 10
            });
        }

        this.chartData = data;
    }

    renderChart() {
        const chartArea = document.getElementById('chartArea');
        if (!chartArea || !this.chartData) return;

        const colorBy = document.getElementById('colorBy').value;
        const pointSize = parseInt(document.getElementById('pointSize').value);

        let trace;
        let layout;

        switch (this.currentChart) {
            case 'pca':
                trace = {
                    x: this.chartData.map(d => d.x),
                    y: this.chartData.map(d => d.y),
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        size: pointSize,
                        color: this.chartData.map(d => d[colorBy]),
                        colorscale: 'Viridis',
                        opacity: 0.7,
                        line: {
                            width: 0.5,
                            color: 'white'
                        }
                    },
                    text: this.chartData.map(d => 
                        `细胞类型: ${d.cell_type}<br>样本: ${d.sample}<br>聚类: ${d.cluster}`
                    ),
                    hovertemplate: '%{text}<br>PC1: %{x}<br>PC2: %{y}<extra></extra>'
                };

                layout = {
                    title: {
                        text: 'PCA降维可视化',
                        font: { size: 18, color: '#2C3E50' }
                    },
                    xaxis: {
                        title: 'PC1',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    yaxis: {
                        title: 'PC2',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#2C3E50' },
                    margin: { t: 60, b: 50, l: 50, r: 50 }
                };
                break;

            case 'umap':
                trace = {
                    x: this.chartData.map(d => d.x * 0.8),
                    y: this.chartData.map(d => d.y * 0.8),
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        size: pointSize,
                        color: this.chartData.map(d => d[colorBy]),
                        colorscale: 'Plasma',
                        opacity: 0.7,
                        line: {
                            width: 0.5,
                            color: 'white'
                        }
                    },
                    text: this.chartData.map(d => 
                        `细胞类型: ${d.cell_type}<br>样本: ${d.sample}<br>聚类: ${d.cluster}`
                    ),
                    hovertemplate: '%{text}<br>UMAP1: %{x}<br>UMAP2: %{y}<extra></extra>'
                };

                layout = {
                    title: {
                        text: 'UMAP降维可视化',
                        font: { size: 18, color: '#2C3E50' }
                    },
                    xaxis: {
                        title: 'UMAP1',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    yaxis: {
                        title: 'UMAP2',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#2C3E50' },
                    margin: { t: 60, b: 50, l: 50, r: 50 }
                };
                break;

            case 'heatmap':
                // 生成热图数据
                const genes = ['GENE1', 'GENE2', 'GENE3', 'GENE4', 'GENE5', 'GENE6', 'GENE7', 'GENE8'];
                const cellTypes = ['T细胞', 'B细胞', 'NK细胞', '单核细胞'];
                
                const heatmapData = [];
                genes.forEach(gene => {
                    cellTypes.forEach(cellType => {
                        heatmapData.push({
                            x: cellType,
                            y: gene,
                            z: Math.random() * 10
                        });
                    });
                });

                trace = {
                    x: cellTypes,
                    y: genes,
                    z: Array.from({length: genes.length}, () => 
                        Array.from({length: cellTypes.length}, () => Math.random() * 10)
                    ),
                    type: 'heatmap',
                    colorscale: 'RdYlBu',
                    hoverongaps: false
                };

                layout = {
                    title: {
                        text: '基因表达热图',
                        font: { size: 18, color: '#2C3E50' }
                    },
                    xaxis: {
                        title: '细胞类型',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    yaxis: {
                        title: '基因',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#2C3E50' },
                    margin: { t: 60, b: 50, l: 100, r: 50 }
                };
                break;

            case 'violin':
                const cellTypes = ['T细胞', 'B细胞', 'NK细胞', '单核细胞', '树突细胞'];
                const violinData = cellTypes.map(cellType => ({
                    y: Array.from({length: 200}, () => Math.random() * 10),
                    name: cellType,
                    type: 'violin',
                    box: { visible: true },
                    meanline: { visible: true }
                }));

                trace = violinData;

                layout = {
                    title: {
                        text: '基因表达分布小提琴图',
                        font: { size: 18, color: '#2C3E50' }
                    },
                    xaxis: {
                        title: '细胞类型',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    yaxis: {
                        title: '表达水平',
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#2C3E50' },
                    margin: { t: 60, b: 50, l: 50, r: 50 }
                };
                break;
        }

        Plotly.newPlot(chartArea, Array.isArray(trace) ? trace : [trace], layout, {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
        });
    }

    updateChart() {
        if (this.chartData) {
            this.renderChart();
        }
    }

    downloadChart(format) {
        const chartArea = document.getElementById('chartArea');
        if (!chartArea) return;

        switch (format) {
            case 'png':
                Plotly.downloadImage(chartArea, {
                    format: 'png',
                    width: 800,
                    height: 600,
                    filename: `${this.dataset.title}_${this.currentChart}`
                });
                break;
            case 'svg':
                Plotly.downloadImage(chartArea, {
                    format: 'svg',
                    width: 800,
                    height: 600,
                    filename: `${this.dataset.title}_${this.currentChart}`
                });
                break;
            case 'html':
                const html = chartArea.innerHTML;
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.dataset.title}_${this.currentChart}.html`;
                a.click();
                URL.revokeObjectURL(url);
                break;
            case 'data':
                const data = JSON.stringify(this.chartData, null, 2);
                const dataBlob = new Blob([data], { type: 'application/json' });
                const dataUrl = URL.createObjectURL(dataBlob);
                const dataA = document.createElement('a');
                dataA.href = dataUrl;
                dataA.download = `${this.dataset.title}_data.json`;
                dataA.click();
                URL.revokeObjectURL(dataUrl);
                break;
        }
    }

    shareDataset() {
        if (navigator.share) {
            navigator.share({
                title: this.dataset.title,
                text: `查看这个单细胞组学数据集: ${this.dataset.title}`,
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('链接已复制到剪贴板');
            });
        }
    }

    downloadDataset() {
        // 模拟下载过程
        this.showNotification('开始下载数据集...');
        
        setTimeout(() => {
            this.showNotification('数据集下载完成！');
        }, 2000);
    }

    loadMetadata() {
        const metadataContent = document.getElementById('metadataContent');
        if (!metadataContent) return;

        const metadata = [
            {
                title: '实验设计',
                content: '本研究采用单细胞RNA测序技术，对样本进行了全面的转录组分析。实验设计遵循标准流程，确保数据质量。'
            },
            {
                title: '质量控制',
                content: '数据经过严格的质量控制，包括基因表达过滤、细胞过滤等步骤。最终保留了高质量的细胞和基因用于后续分析。'
            },
            {
                title: '数据处理',
                content: '原始数据经过标准化处理，包括log转换、批次效应校正等。使用标准化的生物信息学流程进行数据分析。'
            },
            {
                title: '统计分析',
                content: '采用多种统计方法进行差异表达分析、聚类分析等。所有分析结果均经过多重检验校正。'
            }
        ];

        metadataContent.innerHTML = metadata.map(item => `
            <div class="metadata-item">
                <h4>${item.title}</h4>
                <p>${item.content}</p>
            </div>
        `).join('');
    }

    loadRelatedDatasets() {
        const container = document.getElementById('relatedDatasets');
        if (!container) return;

        // 获取相关数据集（同物种或同平台）
        const relatedDatasets = mockDatasets
            .filter(d => d.id !== this.dataset.id && 
                        (d.species === this.dataset.species || d.platform === this.dataset.platform))
            .slice(0, 3);

        if (relatedDatasets.length === 0) {
            container.innerHTML = '<p>暂无相关数据集</p>';
            return;
        }

        container.innerHTML = relatedDatasets.map(dataset => `
            <div class="related-card" onclick="window.location.href='dataset-detail.html?id=${dataset.id}'">
                <h4>${dataset.title}</h4>
                <p>${dataset.description}</p>
                <div class="related-meta">
                    <span><i class="fas fa-user"></i> ${dataset.author}</span>
                    <span><i class="fas fa-calendar"></i> ${dataset.year}</span>
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>错误</h2>
                    <p>${message}</p>
                    <a href="datasets.html" class="btn btn-primary">返回数据集列表</a>
                </div>
            `;
        }
    }

    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 15px;
            padding: 15px 20px;
            box-shadow: 0 8px 32px var(--shadow-light);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 初始化详情页面
let datasetDetailPage;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dataset-detail.html')) {
        datasetDetailPage = new DatasetDetailPage();
    }
});
