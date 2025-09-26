// 登录页面功能

class LoginPage {
    constructor() {
        this.isLoginMode = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // 登录/注册切换
        const registerLink = document.querySelector('.register-link');
        const loginLink = document.querySelector('.login-link');
        
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToRegister();
            });
        }

        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToLogin();
            });
        }

        // 密码显示/隐藏
        this.setupPasswordToggles();

        // 社交登录
        this.setupSocialLogin();

        // 忘记密码
        const forgotPasswordLink = document.querySelector('.forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }

    setupFormValidation() {
        // 登录表单
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 注册表单
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // 实时验证
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // 邮箱验证
        const emailFields = ['email', 'regEmail'];
        emailFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateEmail(field.value, fieldId);
                });
            }
        });

        // 密码验证
        const passwordField = document.getElementById('regPassword');
        if (passwordField) {
            passwordField.addEventListener('input', () => {
                this.validatePassword(passwordField.value);
                this.validatePasswordMatch();
            });
        }

        // 确认密码验证
        const confirmPasswordField = document.getElementById('confirmPassword');
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('blur', () => {
                this.validatePasswordMatch();
            });
        }

        // 姓名验证
        const nameField = document.getElementById('regName');
        if (nameField) {
            nameField.addEventListener('blur', () => {
                this.validateName(nameField.value);
            });
        }
    }

    setupPasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.parentElement.querySelector('input');
                const icon = toggle.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    setupSocialLogin() {
        const googleBtn = document.querySelector('.google-btn');
        const githubBtn = document.querySelector('.github-btn');

        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('google');
            });
        }

        if (githubBtn) {
            githubBtn.addEventListener('click', () => {
                this.handleSocialLogin('github');
            });
        }
    }

    switchToRegister() {
        const loginCard = document.querySelector('.login-card');
        const registerCard = document.getElementById('registerCard');
        
        if (loginCard && registerCard) {
            loginCard.style.display = 'none';
            registerCard.style.display = 'block';
            this.isLoginMode = false;
        }
    }

    switchToLogin() {
        const loginCard = document.querySelector('.login-card');
        const registerCard = document.getElementById('registerCard');
        
        if (loginCard && registerCard) {
            loginCard.style.display = 'block';
            registerCard.style.display = 'none';
            this.isLoginMode = true;
        }
    }

    validateEmail(email, fieldId) {
        if (!email) {
            this.showFieldError(fieldId, '邮箱地址不能为空');
            return false;
        }

        if (!utils.validateEmail(email)) {
            this.showFieldError(fieldId, '请输入有效的邮箱地址');
            return false;
        }

        this.clearFieldError(fieldId);
        return true;
    }

    validatePassword(password) {
        const fieldId = 'regPassword';
        
        if (!password) {
            this.showFieldError(fieldId, '密码不能为空');
            return false;
        }

        if (password.length < 8) {
            this.showFieldError(fieldId, '密码长度至少8位');
            return false;
        }

        // 密码强度检查
        const strength = this.checkPasswordStrength(password);
        this.updatePasswordStrength(strength);

        this.clearFieldError(fieldId);
        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const fieldId = 'confirmPassword';

        if (!confirmPassword) {
            this.showFieldError(fieldId, '请确认密码');
            return false;
        }

        if (password !== confirmPassword) {
            this.showFieldError(fieldId, '两次输入的密码不一致');
            return false;
        }

        this.clearFieldError(fieldId);
        return true;
    }

    validateName(name) {
        const fieldId = 'regName';
        
        if (!name) {
            this.showFieldError(fieldId, '姓名不能为空');
            return false;
        }

        if (name.length < 2) {
            this.showFieldError(fieldId, '姓名长度至少2位');
            return false;
        }

        this.clearFieldError(fieldId);
        return true;
    }

    checkPasswordStrength(password) {
        let score = 0;
        
        // 长度检查
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // 字符类型检查
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return 'weak';
        if (score <= 4) return 'medium';
        return 'strong';
    }

    updatePasswordStrength(strength) {
        // 这里可以添加密码强度指示器的更新逻辑
        console.log('Password strength:', strength);
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // 验证输入
        if (!this.validateEmail(email, 'email')) return;
        if (!password) {
            this.showFieldError('password', '密码不能为空');
            return;
        }

        // 显示加载状态
        this.setLoadingState('loginForm', true);

        try {
            // 模拟登录API调用
            await this.simulateLogin(email, password);
            
            // 登录成功
            this.showNotification('登录成功！', 'success');
            
            // 保存登录状态
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('userEmail', email);
            }
            
            // 跳转到首页
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.showNotification('登录失败，请检查邮箱和密码', 'error');
        } finally {
            this.setLoadingState('loginForm', false);
        }
    }

    async handleRegister() {
        const formData = this.collectRegisterData();

        // 验证所有字段
        if (!this.validateRegisterForm(formData)) return;

        // 显示加载状态
        this.setLoadingState('registerForm', true);

        try {
            // 模拟注册API调用
            await this.simulateRegister(formData);
            
            // 注册成功
            this.showNotification('注册成功！请登录', 'success');
            
            // 切换到登录模式
            setTimeout(() => {
                this.switchToLogin();
            }, 1500);

        } catch (error) {
            this.showNotification('注册失败，请重试', 'error');
        } finally {
            this.setLoadingState('registerForm', false);
        }
    }

    collectRegisterData() {
        return {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            institution: document.getElementById('institution').value,
            agreeTerms: document.getElementById('agreeTerms').checked
        };
    }

    validateRegisterForm(formData) {
        let isValid = true;

        // 验证所有字段
        if (!this.validateName(formData.name)) isValid = false;
        if (!this.validateEmail(formData.email, 'regEmail')) isValid = false;
        if (!this.validatePassword(formData.password)) isValid = false;
        if (!this.validatePasswordMatch()) isValid = false;

        // 验证同意条款
        if (!formData.agreeTerms) {
            this.showFieldError('agreeTerms', '请同意服务条款和隐私政策');
            isValid = false;
        }

        return isValid;
    }

    async simulateLogin(email, password) {
        // 模拟网络延迟
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟登录验证
                if (email === 'admin@example.com' && password === 'password123') {
                    resolve({ success: true, user: { email, name: 'Admin User' } });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1500);
        });
    }

    async simulateRegister(formData) {
        // 模拟网络延迟
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟注册验证
                if (formData.email === 'admin@example.com') {
                    reject(new Error('Email already exists'));
                } else {
                    resolve({ success: true, user: formData });
                }
            }, 1500);
        });
    }

    handleSocialLogin(provider) {
        this.showNotification(`正在使用 ${provider} 登录...`, 'info');
        
        // 模拟社交登录
        setTimeout(() => {
            this.showNotification(`${provider} 登录成功！`, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 2000);
    }

    handleForgotPassword() {
        const email = prompt('请输入您的邮箱地址：');
        if (email && utils.validateEmail(email)) {
            this.showNotification('密码重置链接已发送到您的邮箱', 'success');
        } else if (email) {
            this.showNotification('请输入有效的邮箱地址', 'error');
        }
    }

    setLoadingState(formId, isLoading) {
        const form = document.getElementById(formId);
        if (!form) return;

        const submitBtn = form.querySelector('.login-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
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

    showNotification(message, type = 'success') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icons[type]}"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加样式
        const colors = {
            success: 'var(--accent-green)',
            error: '#DC3545',
            info: 'var(--primary-blue)'
        };

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
            color: ${colors[type]};
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

// 初始化登录页面
let loginPage;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('login.html')) {
        loginPage = new LoginPage();
    }
});
