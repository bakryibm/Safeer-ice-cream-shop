// Login Component
class LoginComponent {
    static render() {
        return `
            <div class="container-fluid login-container">
                <div class="row justify-content-center align-items-center min-vh-100">
                    <div class="col-md-6 col-lg-4">
                        <div class="card shadow-lg">
                            <div class="card-body p-5">
                                <div class="text-center mb-4">
                                    <h1 class="display-4">🍦</h1>
                                    <h2 class="card-title">نظام إدارة محل الآيس كريم</h2>
                                    <p class="text-muted">مرحباً بك في نظام الإدارة المتكامل</p>
                                </div>
                                
                                <form id="login-form">
                                    <div class="mb-3">
                                        <label for="username" class="form-label">اسم المستخدم</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                                            <input type="text" class="form-control" id="username" value="admin" required>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="password" class="form-label">كلمة المرور</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                            <input type="password" class="form-control" id="password" value="admin123" required>
                                        </div>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-primary w-100">
                                        <i class="fas fa-sign-in-alt me-2"></i>تسجيل الدخول
                                    </button>
                                </form>
                                
                                <div class="mt-3 text-center">
                                    <small class="text-muted">
                                        المستخدم الافتراضي: admin / admin123
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static init() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', this.handleLogin.bind(this));
        }
    }

    static handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin123') {
            app.showToast('تم تسجيل الدخول بنجاح', 'مرحباً بك في نظام الإدارة', 'success');
            // Login logic handled by main app
        } else {
            app.showToast('خطأ في تسجيل الدخول', 'اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    }
}
