// 数据集提交页面功能

class SubmitPage {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressIndicator();
    }

    setupEventListeners() {
        // 下一步按钮
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextStep();
            });
        }

        // 上一步按钮
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevStep();
            });
        }

        // 表单提交
        const form = document.getElementById('submitForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }

        // 实时验证
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const requiredFields = [
            'datasetTitle', 'authorName', 'authorEmail', 'publicationYear',
            'species', 'platform', 'sampleCount', 'cellCount', 'dataLink',
            'reproStatus'
        ];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(fieldId);
                });
                field.addEventListener('input', () => {
                    this.clearFieldError(fieldId);
                });
            }
        });

        // 特殊验证
        const emailField = document.getElementById('authorEmail');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                this.validateEmail(emailField.value);
            });
        }

        const doiField = document.getElementById('doi');
        if (doiField) {
            doiField.addEventListener('blur', () => {
                this.validateDOI(doiField.value);
            });
        }

        const dataLinkField = document.getElementById('dataLink');
        if (dataLinkField) {
            dataLinkField.addEventListener('blur', () => {
                this.validateURL(dataLinkField.value, 'dataLink');
            });
        }

        const codeLinkField = document.getElementById('codeLink');
        if (codeLinkField) {
            codeLinkField.addEventListener('blur', () => {
                this.validateURL(codeLinkField.value, 'codeLink');
            });
        }

        const confirmPasswordField = document.getElementById('confirmPassword');
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('blur', () => {
                this.validatePasswordMatch();
            });
        }
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const isRequired = this.isRequiredField(fieldId);

        if (isRequired && !value) {
            this.showFieldError(fieldId, '此字段为必填项');
            return false;
        }

        if (value) {
            switch (fieldId) {
                case 'publicationYear':
                    const year = parseInt(value);
                    if (year < 2000 || year > 2024) {
                        this.showFieldError(fieldId, '年份必须在2000-2024之间');
                        return false;
                    }
                    break;
                case 'sampleCount':
                case 'cellCount':
                    const count = parseInt(value);
                    if (count < 1) {
                        this.showFieldError(fieldId, '数量必须大于0');
                        return false;
                    }
                    break;
                case 'reproTime':
                    const time = parseFloat(value);
                    if (time < 0) {
                        this.showFieldError(fieldId, '时间不能为负数');
                        return false;
                    }
                    break;
            }
        }

        this.clearFieldError(fieldId);
        return true;
    }

    validateEmail(email) {
        if (!email) return true; // 非必填字段
        
        if (!utils.validateEmail(email)) {
            this.showFieldError('authorEmail', '请输入有效的邮箱地址');
            return false;
        }
        this.clearFieldError('authorEmail');
        return true;
    }

    validateDOI(doi) {
        if (!doi) return true; // 非必填字段
        
        const doiPattern = /^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/;
        if (!doiPattern.test(doi)) {
            this.showFieldError('doi', '请输入有效的DOI格式');
            return false;
        }
        this.clearFieldError('doi');
        return true;
    }

    validateURL(url, fieldId) {
        if (!url) return true; // 非必填字段
        
        if (!utils.validateUrl(url)) {
            this.showFieldError(fieldId, '请输入有效的URL地址');
            return false;
        }
        this.clearFieldError(fieldId);
        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirmPassword', '两次输入的密码不一致');
            return false;
        }
        this.clearFieldError('confirmPassword');
        return true;
    }

    isRequiredField(fieldId) {
        const requiredFields = [
            'datasetTitle', 'authorName', 'authorEmail', 'publicationYear',
            'species', 'platform', 'sampleCount', 'cellCount', 'dataLink',
            'reproStatus'
        ];
        return requiredFields.includes(fieldId);
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        
        if (field) {
            field.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return false;

        const fields = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            const fieldId = field.id;
            if (fieldId && this.isRequiredField(fieldId)) {
                if (!this.validateField(fieldId)) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            this.showNotification('请填写所有必填字段', 'error');
            return;
        }

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            this.updateProgressIndicator();
            this.updateButtons();
            
            if (this.currentStep === this.totalSteps) {
                this.generateConfirmationSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgressIndicator();
            this.updateButtons();
        }
    }

    updateStepDisplay() {
        // 隐藏所有步骤
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // 显示当前步骤
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }

    updateProgressIndicator() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
    }

    updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-flex' : 'none';
        }

        if (submitBtn) {
            submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-flex' : 'none';
        }
    }

    generateConfirmationSummary() {
        const summaryContainer = document.getElementById('confirmationSummary');
        if (!summaryContainer) return;

        // 收集所有表单数据
        const formData = this.collectFormData();

        const summaryHTML = `
            <div class="confirmation-section">
                <h4><i class="fas fa-info-circle"></i> 基本信息</h4>
                <div class="confirmation-item">
                    <span class="label">数据集标题:</span>
                    <span class="value">${formData.datasetTitle}</span>
                </div>
                <div class="confirmation-item">
                    <span class="label">作者:</span>
                    <span class="value">${formData.authorName}</span>
                </div>
                <div class="confirmation-item">
                    <span class="label">邮箱:</span>
                    <span class="value">${formData.authorEmail}</span>
                </div>
                <div class="confirmation-item">
                    <span class="label">发表年份:</span>
                    <span class="value">${formData.publicationYear}</span>
                </div>
            </div>

            <div class="confirmation-section">
                <h4><i class="fas fa-database"></i> 数据信息</h4>
                <div class="confirmation-item">
                    <span class="label">物种:</span>
                    <span class="value">${formData.species}</span>
                </div>
                <div class="confirmation-item">
                    <span class="label">平台:</span>
                    <span class="value">${formData.platform}</span>
                </div>
                <div class="confirmation-item">
                    <span class="label">样本数:</span>
                    <span class="value">${formData.sampleCount}</span>
                </div>
                <div class="confirmation-item">
                    <span class="label">细胞数:</span>
                    <span class="value">${formData.cellCount}</span>
                </div>
            </div>

            <div class="confirmation-section">
                <h4><i class="fas fa-code"></i> 复现信息</h4>
                <div class="confirmation-item">
                    <span class="label">复现状态:</span>
                    <span class="value">${formData.reproStatus}</span>
                </div>
                <div class="confirmation-item">
                    <span class="label">复现时间:</span>
                    <span class="value">${formData.reproTime || '未填写'} 小时</span>
                </div>
            </div>
        `;

        summaryContainer.innerHTML = summaryHTML;
    }

    collectFormData() {
        const formData = {};
        const form = document.getElementById('submitForm');
        
        if (form) {
            const formElements = form.querySelectorAll('input, select, textarea');
            formElements.forEach(element => {
                if (element.name) {
                    if (element.type === 'checkbox') {
                        formData[element.name] = element.checked;
                    } else {
                        formData[element.name] = element.value;
                    }
                }
            });
        }

        return formData;
    }

    async submitForm() {
        // 验证最后一步
        if (!this.validateCurrentStep()) {
            this.showNotification('请填写所有必填字段', 'error');
            return;
        }

        // 检查同意条款
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            this.showFieldError('agreeTerms', '请同意服务条款和隐私政策');
            return;
        }

        // 收集所有数据
        const formData = this.collectFormData();
        
        // 显示加载状态
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;

        try {
            // 模拟API调用
            await this.simulateSubmission(formData);
            
            // 显示成功模态框
            this.showSuccessModal();
            
        } catch (error) {
            this.showNotification('提交失败，请重试', 'error');
        } finally {
            // 恢复按钮状态
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    async simulateSubmission(formData) {
        // 模拟网络延迟
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟成功提交
                console.log('提交的数据:', formData);
                resolve(formData);
            }, 2000);
        });
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    showNotification(message, type = 'success') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
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
            color: ${type === 'error' ? '#DC3545' : 'var(--accent-green)'};
        `;

        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 初始化提交页面
let submitPage;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('submit.html')) {
        submitPage = new SubmitPage();
    }
});
