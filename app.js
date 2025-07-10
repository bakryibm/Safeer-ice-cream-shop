// Main Application Controller
class IceCreamApp {
    constructor() {
        this.currentUser = null;
        this.currentComponent = null;
        // Initialize data service - use client-side service if available, otherwise default service
        this.dataService = window.clientDataService || new DataService();
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.hideLoading();
            this.showLogin();
        });
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Navigation menu
        const navItems = document.querySelectorAll('[data-component]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const component = e.target.getAttribute('data-component') || 
                                e.target.closest('[data-component]').getAttribute('data-component');
                this.navigateToComponent(component);
            });
        });

        // Handle window resize for mobile
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('d-none');
        }
    }

    showLogin() {
        const loginComponent = document.getElementById('login-component');
        if (loginComponent) {
            loginComponent.classList.remove('d-none');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in real app, this would be server-side)
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { username: 'admin', role: 'admin', name: 'المدير' };
            this.showMainApp();
        } else {
            this.showToast('خطأ في تسجيل الدخول', 'اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    }

    showMainApp() {
        document.getElementById('login-component').classList.add('d-none');
        document.getElementById('main-app').classList.remove('d-none');
        document.getElementById('current-user').textContent = this.currentUser.name;
        this.navigateToComponent('dashboard');
    }

    logout() {
        this.currentUser = null;
        this.currentComponent = null;
        document.getElementById('main-app').classList.add('d-none');
        document.getElementById('login-component').classList.remove('d-none');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    navigateToComponent(componentName) {
        // Update active navigation
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-component="${componentName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Load component content
        this.loadComponent(componentName);
    }

    async loadComponent(componentName) {
        const contentArea = document.getElementById('content-area');
        
        // Show loading
        contentArea.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';

        try {
            let componentHtml = '';
            
            switch (componentName) {
                case 'dashboard':
                    componentHtml = await MainDashboard.render();
                    break;
                case 'sales':
                    componentHtml = await SalesWindow.render();
                    break;
                case 'products':
                    componentHtml = await ProductsWindow.render();
                    break;
                case 'inventory':
                    componentHtml = await InventoryWindow.render();
                    break;
                case 'customers':
                    componentHtml = await CustomersWindow.render();
                    break;
                case 'reports':
                    componentHtml = await ReportsWindow.render();
                    break;
                case 'users':
                    componentHtml = await UsersWindow.render();
                    break;
                case 'settings':
                    componentHtml = await SettingsWindow.render();
                    break;
                default:
                    componentHtml = '<div class="alert alert-warning">المكون غير متاح</div>';
            }

            contentArea.innerHTML = componentHtml;
            contentArea.classList.add('fade-in');
            
            // Initialize component-specific functionality
            this.initializeComponent(componentName);
            
        } catch (error) {
            console.error('Error loading component:', error);
            contentArea.innerHTML = '<div class="alert alert-danger">حدث خطأ في تحميل المكون</div>';
        }
    }

    initializeComponent(componentName) {
        switch (componentName) {
            case 'dashboard':
                MainDashboard.init();
                break;
            case 'sales':
                SalesWindow.init();
                break;
            case 'products':
                ProductsWindow.init();
                break;
            case 'inventory':
                InventoryWindow.init();
                break;
            case 'customers':
                CustomersWindow.init();
                break;
            case 'reports':
                ReportsWindow.init();
                break;
            case 'users':
                UsersWindow.init();
                break;
            case 'settings':
                SettingsWindow.init();
                break;
        }
    }

    showToast(title, message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        const iconClass = type === 'error' ? 'fa-exclamation-triangle' : 
                         type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        
        const bgClass = type === 'error' ? 'bg-danger' : 
                       type === 'success' ? 'bg-success' : 'bg-primary';

        toast.innerHTML = `
            <div class="toast-header ${bgClass} text-white">
                <i class="fas ${iconClass} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;

        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    handleResize() {
        // Handle mobile responsive behavior
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-OM', {
            style: 'currency',
            currency: 'OMR',
            minimumFractionDigits: 3
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('ar-OM', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
}

// Initialize the application
const app = new IceCreamApp();
