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
        contentArea.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">جاري التحميل...</p></div>';

        try {
            let componentHtml = '';
            
            // Check if component classes exist
            const componentClasses = {
                'dashboard': window.MainDashboard,
                'sales': window.SalesWindow,
                'products': window.ProductsWindow,
                'inventory': window.InventoryWindow,
                'customers': window.CustomersWindow,
                'reports': window.ReportsWindow,
                'users': window.UsersWindow,
                'settings': window.SettingsWindow
            };

            const ComponentClass = componentClasses[componentName];
            
            if (!ComponentClass) {
                throw new Error(`Component ${componentName} not found`);
            }

            if (typeof ComponentClass.render !== 'function') {
                throw new Error(`Component ${componentName} render method not found`);
            }

            componentHtml = await ComponentClass.render();

            contentArea.innerHTML = componentHtml;
            contentArea.classList.add('fade-in');
            
            // Initialize component-specific functionality
            this.initializeComponent(componentName);
            
        } catch (error) {
            console.error('Error loading component:', error);
            contentArea.innerHTML = `
                <div class="alert alert-danger">
                    <h4 class="alert-heading">خطأ في تحميل المكون</h4>
                    <p>حدث خطأ أثناء تحميل المكون: ${componentName}</p>
                    <hr>
                    <p class="mb-0">تفاصيل الخطأ: ${error.message}</p>
                    <button class="btn btn-outline-danger mt-2" onclick="app.navigateToComponent('dashboard')">
                        <i class="fas fa-home me-2"></i>العودة للرئيسية
                    </button>
                </div>`;
        }
    }

    initializeComponent(componentName) {
        try {
            const componentClasses = {
                'dashboard': window.MainDashboard,
                'sales': window.SalesWindow,
                'products': window.ProductsWindow,
                'inventory': window.InventoryWindow,
                'customers': window.CustomersWindow,
                'reports': window.ReportsWindow,
                'users': window.UsersWindow,
                'settings': window.SettingsWindow
            };

            const ComponentClass = componentClasses[componentName];
            
            if (ComponentClass && typeof ComponentClass.init === 'function') {
                ComponentClass.init();
            } else {
                console.warn(`Component ${componentName} init method not found`);
            }
        } catch (error) {
            console.error(`Error initializing component ${componentName}:`, error);
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

// Make app globally available for components
window.app = app;
