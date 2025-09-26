// 主要JavaScript文件 - 通用功能

// 模拟数据集数据
const mockDatasets = [
    {
        id: 1,
        title: "人类大脑皮层单细胞转录组分析",
        author: "Zhang et al.",
        year: 2024,
        doi: "10.1038/s41586-024-xxxxx",
        species: "人类",
        platform: "10X Genomics",
        samples: 12,
        cells: 45000,
        status: "已复现",
        journal: "Nature",
        publishDate: "2024-01-15",
        citationCount: 156,
        dataLink: "https://example.com/data1",
        codeLink: "https://github.com/example/repo1",
        envRequirements: "R 4.0+, Seurat 4.0+",
        reproTime: 2.5,
        description: "本研究分析了人类大脑皮层不同区域的单细胞转录组数据，揭示了细胞类型特异性表达模式。"
    },
    {
        id: 2,
        title: "小鼠肝脏发育过程中的细胞分化",
        author: "Li et al.",
        year: 2023,
        doi: "10.1016/j.cell.2023.xxxxx",
        species: "小鼠",
        platform: "Smart-seq2",
        samples: 8,
        cells: 28000,
        status: "复现中",
        journal: "Cell",
        publishDate: "2023-11-20",
        citationCount: 89,
        dataLink: "https://example.com/data2",
        codeLink: "https://github.com/example/repo2",
        envRequirements: "Python 3.8+, Scanpy 1.8+",
        reproTime: 4.0,
        description: "通过单细胞RNA测序技术研究小鼠肝脏发育过程中的细胞分化轨迹。"
    },
    {
        id: 3,
        title: "果蝇胚胎发育的时空转录组图谱",
        author: "Wang et al.",
        year: 2023,
        doi: "10.1126/science.2023.xxxxx",
        species: "果蝇",
        platform: "Drop-seq",
        samples: 15,
        cells: 32000,
        status: "未复现",
        journal: "Science",
        publishDate: "2023-09-10",
        citationCount: 234,
        dataLink: "https://example.com/data3",
        codeLink: "",
        envRequirements: "R 4.1+, Monocle3",
        reproTime: 6.0,
        description: "构建了果蝇胚胎发育的完整时空转录组图谱，揭示了发育过程中的基因表达动态。"
    },
    {
        id: 4,
        title: "斑马鱼心脏再生的单细胞分析",
        author: "Chen et al.",
        year: 2024,
        doi: "10.1038/nm.2024.xxxxx",
        species: "斑马鱼",
        platform: "10X Genomics",
        samples: 6,
        cells: 18000,
        status: "已复现",
        journal: "Nature Medicine",
        publishDate: "2024-02-05",
        citationCount: 67,
        dataLink: "https://example.com/data4",
        codeLink: "https://github.com/example/repo4",
        envRequirements: "R 4.2+, Seurat 5.0+",
        reproTime: 3.5,
        description: "研究斑马鱼心脏再生过程中的细胞类型变化和基因表达模式。"
    },
    {
        id: 5,
        title: "拟南芥根尖分生组织的单细胞转录组",
        author: "Liu et al.",
        year: 2023,
        doi: "10.1016/j.devcel.2023.xxxxx",
        species: "拟南芥",
        platform: "CEL-seq2",
        samples: 10,
        cells: 22000,
        status: "复现中",
        journal: "Developmental Cell",
        publishDate: "2023-12-15",
        citationCount: 45,
        dataLink: "https://example.com/data5",
        codeLink: "https://github.com/example/repo5",
        envRequirements: "Python 3.9+, Scanpy 1.9+",
        reproTime: 5.0,
        description: "分析拟南芥根尖分生组织中不同细胞类型的转录组特征。"
    }
];

// 通用工具函数
const utils = {
    // 格式化数字
    formatNumber: (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // 格式化日期
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN');
    },

    // 防抖函数
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 生成随机ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // 验证邮箱
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // 验证URL
    validateUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// 导航栏功能
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupScrollEffect();
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // 点击菜单项时关闭移动菜单
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupScrollEffect() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScrollTop = 0;
        const scrollHandler = utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.style.background = 'rgba(30, 58, 138, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(30, 58, 138, 0.9)';
                navbar.style.backdropFilter = 'blur(20px)';
            }

            lastScrollTop = scrollTop;
        }, 100);

        window.addEventListener('scroll', scrollHandler);
    }
}

// 动画效果
class Animations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupFloatingCells();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        document.querySelectorAll('.intro-card, .stat-item, .preview-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    setupFloatingCells() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            // 随机化动画延迟
            cell.style.animationDelay = `${Math.random() * 2}s`;
            
            // 添加鼠标悬停效果
            cell.addEventListener('mouseenter', () => {
                cell.style.transform = 'scale(1.2)';
                cell.style.transition = 'transform 0.3s ease';
            });

            cell.addEventListener('mouseleave', () => {
                cell.style.transform = 'scale(1)';
            });
        });
    }
}

// 首页功能
class HomePage {
    constructor() {
        this.init();
    }

    init() {
        this.loadLatestDatasets();
        this.setupHeroButtons();
    }

    loadLatestDatasets() {
        const container = document.getElementById('latestDatasets');
        if (!container) return;

        // 获取最新的3个数据集
        const latestDatasets = mockDatasets.slice(0, 3);
        
        container.innerHTML = latestDatasets.map(dataset => `
            <div class="preview-card" onclick="window.location.href='dataset-detail.html?id=${dataset.id}'">
                <h3>${dataset.title}</h3>
                <p>${dataset.description}</p>
                <div class="preview-meta">
                    <span><i class="fas fa-user"></i> ${dataset.author}</span>
                    <span><i class="fas fa-calendar"></i> ${dataset.year}</span>
                </div>
            </div>
        `).join('');
    }

    setupHeroButtons() {
        const browseBtn = document.querySelector('.hero-buttons .btn-primary');
        const submitBtn = document.querySelector('.hero-buttons .btn-secondary');

        if (browseBtn) {
            browseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'datasets.html';
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'submit.html';
            });
        }
    }
}

// 水波效果
class WaterEffect {
    constructor() {
        this.init();
    }

    init() {
        this.createRipples();
        this.setupMouseEffect();
    }

    createRipples() {
        const waves = document.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            // 随机化动画参数
            const duration = 8 + Math.random() * 4;
            const delay = Math.random() * 2;
            
            wave.style.animationDuration = `${duration}s`;
            wave.style.animationDelay = `${delay}s`;
        });
    }

    setupMouseEffect() {
        document.addEventListener('mousemove', (e) => {
            const waves = document.querySelectorAll('.wave');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            waves.forEach((wave, index) => {
                const intensity = (index + 1) * 0.1;
                const offsetX = (x - 0.5) * intensity * 20;
                const offsetY = (y - 0.5) * intensity * 20;
                
                wave.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化通用功能
    new Navigation();
    new Animations();
    new WaterEffect();

    // 根据页面初始化特定功能
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
            new HomePage();
            break;
        case 'datasets.html':
            // 数据集页面功能在 datasets.js 中实现
            break;
        case 'dataset-detail.html':
            // 详情页面功能在 detail.js 中实现
            break;
        case 'submit.html':
            // 提交页面功能在 submit.js 中实现
            break;
        case 'login.html':
            // 登录页面功能在 login.js 中实现
            break;
    }
});

// 导出工具函数供其他文件使用
window.utils = utils;
window.mockDatasets = mockDatasets;
