// 数据集列表页面功能

class DatasetsPage {
    constructor() {
        this.datasets = [...mockDatasets];
        this.filteredDatasets = [...this.datasets];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortBy = 'year-desc';
        this.currentSort = { field: 'year', direction: 'desc' };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTable();
        this.updateResultsCount();
        this.renderPagination();
    }

    setupEventListeners() {
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }

        // 筛选功能
        const filters = ['speciesFilter', 'platformFilter', 'statusFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.handleFilter();
                });
            }
        });

        // 清除筛选
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // 排序功能
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }

        // 表格标题排序
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.getAttribute('data-sort');
                this.handleTableSort(field);
            });
        });

        // 分页大小
        const pageSizeSelect = document.getElementById('pageSize');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderTable();
                this.renderPagination();
            });
        }
    }

    handleSearch(query) {
        this.currentPage = 1;
        this.filteredDatasets = this.datasets.filter(dataset => {
            const searchText = query.toLowerCase();
            return (
                dataset.title.toLowerCase().includes(searchText) ||
                dataset.author.toLowerCase().includes(searchText) ||
                dataset.species.toLowerCase().includes(searchText) ||
                dataset.platform.toLowerCase().includes(searchText)
            );
        });
        this.renderTable();
        this.updateResultsCount();
        this.renderPagination();
    }

    handleFilter() {
        this.currentPage = 1;
        const speciesFilter = document.getElementById('speciesFilter').value;
        const platformFilter = document.getElementById('platformFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        this.filteredDatasets = this.datasets.filter(dataset => {
            return (
                (!speciesFilter || dataset.species === speciesFilter) &&
                (!platformFilter || dataset.platform === platformFilter) &&
                (!statusFilter || dataset.status === statusFilter)
            );
        });
        this.renderTable();
        this.updateResultsCount();
        this.renderPagination();
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('speciesFilter').value = '';
        document.getElementById('platformFilter').value = '';
        document.getElementById('statusFilter').value = '';
        
        this.filteredDatasets = [...this.datasets];
        this.currentPage = 1;
        this.renderTable();
        this.updateResultsCount();
        this.renderPagination();
    }

    handleSort(sortValue) {
        const [field, direction] = sortValue.split('-');
        this.currentSort = { field, direction };
        this.sortDatasets();
        this.renderTable();
    }

    handleTableSort(field) {
        if (this.currentSort.field === field) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = 'asc';
        }
        this.sortDatasets();
        this.renderTable();
        this.updateSortIndicators();
    }

    sortDatasets() {
        this.filteredDatasets.sort((a, b) => {
            let aVal = a[this.currentSort.field];
            let bVal = b[this.currentSort.field];

            // 处理数字类型
            if (['year', 'samples', 'cells'].includes(this.currentSort.field)) {
                aVal = parseInt(aVal);
                bVal = parseInt(bVal);
            }

            // 处理字符串类型
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.currentSort.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(th => {
            const field = th.getAttribute('data-sort');
            const icon = th.querySelector('i');
            
            if (field === this.currentSort.field) {
                th.classList.add('active');
                icon.className = this.currentSort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            } else {
                th.classList.remove('active');
                icon.className = 'fas fa-sort';
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('datasetsTableBody');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredDatasets.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>未找到匹配的数据集</h3>
                        <p>请尝试调整搜索条件或筛选器</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = pageData.map(dataset => `
            <tr>
                <td>
                    <div class="dataset-title">
                        <a href="dataset-detail.html?id=${dataset.id}" class="title-link">
                            ${dataset.title}
                        </a>
                    </div>
                </td>
                <td>${dataset.author}</td>
                <td>${dataset.year}</td>
                <td>
                    <a href="https://doi.org/${dataset.doi}" target="_blank" class="doi-link">
                        ${dataset.doi}
                    </a>
                </td>
                <td>${dataset.species}</td>
                <td>${dataset.platform}</td>
                <td>${utils.formatNumber(dataset.samples)}</td>
                <td>${utils.formatNumber(dataset.cells)}</td>
                <td>
                    <span class="status-badge status-${dataset.status.replace('已', '').replace('中', '').replace('未', 'not-')}">
                        ${dataset.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <a href="dataset-detail.html?id=${dataset.id}" class="action-btn view">
                            <i class="fas fa-eye"></i>
                            查看
                        </a>
                        <a href="${dataset.dataLink}" target="_blank" class="action-btn download">
                            <i class="fas fa-download"></i>
                            下载
                        </a>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            countElement.textContent = this.filteredDatasets.length;
        }
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredDatasets.length / this.pageSize);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // 上一页按钮
        paginationHTML += `
            <button ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="datasetsPage.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // 页码按钮
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button onclick="datasetsPage.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="${i === this.currentPage ? 'active' : ''}" 
                        onclick="datasetsPage.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button onclick="datasetsPage.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // 下一页按钮
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="datasetsPage.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredDatasets.length / this.pageSize);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderTable();
        this.renderPagination();
        
        // 滚动到表格顶部
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// 初始化数据集页面
let datasetsPage;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('datasets.html')) {
        datasetsPage = new DatasetsPage();
    }
});
