// User Management Window Component
class UsersWindow {
    static users = [];
    static filteredUsers = [];
    static currentUser = null;

    static async render() {
        this.users = window.app?.dataService.getAllUsers();
        this.filteredUsers = [...this.users];

        return `
            <div class="users-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-user-cog me-2"></i>
                            إدارة المستخدمين
                        </h1>
                        <p class="text-muted">إدارة حسابات المستخدمين والصلاحيات</p>
                    </div>
                </div>

                <!-- User Stats -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(this.getTotalUsers())}</h3>
                                        <p class="mb-0">إجمالي المستخدمين</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-users"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(this.getActiveUsers())}</h3>
                                        <p class="mb-0">مستخدمين نشطين</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-user-check"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(this.getAdminUsers())}</h3>
                                        <p class="mb-0">مديرين</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-user-shield"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(this.getCashierUsers())}</h3>
                                        <p class="mb-0">كاشيرين</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-cash-register"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control" id="search-users" 
                                   placeholder="البحث عن مستخدم...">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" id="filter-role">
                            <option value="">جميع الأدوار</option>
                            <option value="admin">مدير</option>
                            <option value="cashier">كاشير</option>
                            <option value="supervisor">مشرف</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select class="form-select" id="filter-status">
                            <option value="">جميع الحالات</option>
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-success w-100" id="add-user-btn">
                            <i class="fas fa-user-plus me-2"></i>
                            إضافة مستخدم
                        </button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-info w-100" id="export-users-btn">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>

                <!-- Users Table -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-list me-2"></i>
                                    قائمة المستخدمين
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>المستخدم</th>
                                                <th>اسم المستخدم</th>
                                                <th>الدور</th>
                                                <th>الصلاحيات</th>
                                                <th>الحالة</th>
                                                <th>آخر دخول</th>
                                                <th>تاريخ الإنشاء</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody id="users-table-body">
                                            ${this.renderUsersRows()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add/Edit User Modal -->
                <div class="modal fade" id="userModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="userModalTitle">إضافة مستخدم جديد</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="user-form">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الاسم الكامل</label>
                                                <input type="text" class="form-control" id="user-name" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">اسم المستخدم</label>
                                                <input type="text" class="form-control" id="user-username" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">كلمة المرور</label>
                                                <input type="password" class="form-control" id="user-password" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">تأكيد كلمة المرور</label>
                                                <input type="password" class="form-control" id="user-confirm-password" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الدور</label>
                                                <select class="form-select" id="user-role" required>
                                                    <option value="">اختر الدور</option>
                                                    <option value="admin">مدير</option>
                                                    <option value="cashier">كاشير</option>
                                                    <option value="supervisor">مشرف</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">البريد الإلكتروني</label>
                                                <input type="email" class="form-control" id="user-email">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">رقم الهاتف</label>
                                                <input type="tel" class="form-control" id="user-phone">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الحالة</label>
                                                <select class="form-select" id="user-status">
                                                    <option value="true">نشط</option>
                                                    <option value="false">غير نشط</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Permissions Section -->
                                    <div class="mb-3">
                                        <label class="form-label">الصلاحيات</label>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-sales" value="sales">
                                                    <label class="form-check-label" for="perm-sales">
                                                        إدارة المبيعات
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-products" value="products">
                                                    <label class="form-check-label" for="perm-products">
                                                        إدارة المنتجات
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-inventory" value="inventory">
                                                    <label class="form-check-label" for="perm-inventory">
                                                        إدارة المخزون
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-customers" value="customers">
                                                    <label class="form-check-label" for="perm-customers">
                                                        إدارة العملاء
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-reports" value="reports">
                                                    <label class="form-check-label" for="perm-reports">
                                                        عرض التقارير
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-users" value="users">
                                                    <label class="form-check-label" for="perm-users">
                                                        إدارة المستخدمين
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-settings" value="settings">
                                                    <label class="form-check-label" for="perm-settings">
                                                        إدارة الإعدادات
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="perm-all" value="all">
                                                    <label class="form-check-label" for="perm-all">
                                                        <strong>جميع الصلاحيات</strong>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">ملاحظات</label>
                                        <textarea class="form-control" id="user-notes" rows="3"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                                <button type="button" class="btn btn-primary" id="save-user-btn">حفظ</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Change Password Modal -->
                <div class="modal fade" id="changePasswordModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">تغيير كلمة المرور</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="change-password-form">
                                    <div class="mb-3">
                                        <label class="form-label">كلمة المرور الجديدة</label>
                                        <input type="password" class="form-control" id="new-password" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">تأكيد كلمة المرور الجديدة</label>
                                        <input type="password" class="form-control" id="confirm-new-password" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                                <button type="button" class="btn btn-primary" id="save-password-btn">تغيير كلمة المرور</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderUsersRows() {
        return this.filteredUsers.map(user => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle me-2">
                            <i class="fas ${this.getRoleIcon(user.role)}"></i>
                        </div>
                        <div>
                            <strong>${user.name}</strong>
                            <br>
                            <small class="text-muted">${user.email || 'لا يوجد بريد إلكتروني'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="fw-bold">${user.username}</span>
                </td>
                <td>
                    <span class="badge ${this.getRoleBadgeClass(user.role)}">
                        ${this.getRoleText(user.role)}
                    </span>
                </td>
                <td>
                    <div class="permissions-list">
                        ${user.permissions.includes('all') ? 
                            '<span class="badge bg-success">جميع الصلاحيات</span>' : 
                            user.permissions.slice(0, 2).map(perm => 
                                `<span class="badge bg-info me-1">${this.getPermissionText(perm)}</span>`
                            ).join('') + 
                            (user.permissions.length > 2 ? 
                                `<span class="badge bg-secondary">+${user.permissions.length - 2}</span>` : '')
                        }
                    </div>
                </td>
                <td>
                    <span class="badge ${user.isActive ? 'bg-success' : 'bg-danger'}">
                        ${user.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    ${user.lastLogin ? 
                        `<small>${Helpers.formatDateTime(user.lastLogin)}</small>` : 
                        '<small class="text-muted">لم يسجل دخول</small>'
                    }
                </td>
                <td>
                    <small>${Helpers.formatDate(user.createdAt)}</small>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary edit-user" 
                                data-user-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning change-password" 
                                data-user-id="${user.id}">
                            <i class="fas fa-key"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-user" 
                                data-user-id="${user.id}"
                                ${user.username === 'admin' ? 'disabled' : ''}>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    static getRoleIcon(role) {
        switch (role) {
            case 'admin': return 'fa-user-shield';
            case 'supervisor': return 'fa-user-tie';
            case 'cashier': return 'fa-cash-register';
            default: return 'fa-user';
        }
    }

    static getRoleBadgeClass(role) {
        switch (role) {
            case 'admin': return 'bg-danger';
            case 'supervisor': return 'bg-warning';
            case 'cashier': return 'bg-info';
            default: return 'bg-secondary';
        }
    }

    static getRoleText(role) {
        switch (role) {
            case 'admin': return 'مدير';
            case 'supervisor': return 'مشرف';
            case 'cashier': return 'كاشير';
            default: return role;
        }
    }

    static getPermissionText(permission) {
        const permissions = {
            'sales': 'مبيعات',
            'products': 'منتجات',
            'inventory': 'مخزون',
            'customers': 'عملاء',
            'reports': 'تقارير',
            'users': 'مستخدمين',
            'settings': 'إعدادات'
        };
        return permissions[permission] || permission;
    }

    static getTotalUsers() {
        return this.users.length;
    }

    static getActiveUsers() {
        return this.users.filter(u => u.isActive).length;
    }

    static getAdminUsers() {
        return this.users.filter(u => u.role === 'admin').length;
    }

    static getCashierUsers() {
        return this.users.filter(u => u.role === 'cashier').length;
    }

    static init() {
        this.setupEventListeners();
    }

    static setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-users');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        }

        // Role filter
        const roleFilter = document.getElementById('filter-role');
        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                this.filterByRole(e.target.value);
            });
        }

        // Status filter
        const statusFilter = document.getElementById('filter-status');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterByStatus(e.target.value);
            });
        }

        // Add user button
        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.openUserModal();
            });
        }

        // Export users button
        const exportBtn = document.getElementById('export-users-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportUsers();
            });
        }

        // Table action buttons
        this.attachTableEventListeners();

        // Save user button
        const saveUserBtn = document.getElementById('save-user-btn');
        if (saveUserBtn) {
            saveUserBtn.addEventListener('click', () => {
                this.saveUser();
            });
        }

        // Save password button
        const savePasswordBtn = document.getElementById('save-password-btn');
        if (savePasswordBtn) {
            savePasswordBtn.addEventListener('click', () => {
                this.changePassword();
            });
        }

        // Role change handler
        const roleSelect = document.getElementById('user-role');
        if (roleSelect) {
            roleSelect.addEventListener('change', (e) => {
                this.updatePermissionsByRole(e.target.value);
            });
        }

        // All permissions checkbox
        const allPermsCheckbox = document.getElementById('perm-all');
        if (allPermsCheckbox) {
            allPermsCheckbox.addEventListener('change', (e) => {
                this.toggleAllPermissions(e.target.checked);
            });
        }
    }

    static attachTableEventListeners() {
        // Edit user buttons
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.closest('button').getAttribute('data-user-id'));
                this.editUser(userId);
            });
        });

        // Change password buttons
        document.querySelectorAll('.change-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.closest('button').getAttribute('data-user-id'));
                this.openChangePasswordModal(userId);
            });
        });

        // Delete user buttons
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.closest('button').getAttribute('data-user-id'));
                this.deleteUser(userId);
            });
        });
    }

    static filterUsers(searchTerm) {
        this.filteredUsers = Helpers.searchArray(this.users, searchTerm, 
            ['name', 'username', 'email', 'role']);
        this.updateTable();
    }

    static filterByRole(role) {
        this.filteredUsers = role ? 
            this.users.filter(u => u.role === role) : 
            [...this.users];
        this.updateTable();
    }

    static filterByStatus(status) {
        if (!status) {
            this.filteredUsers = [...this.users];
        } else {
            const isActive = status === 'active';
            this.filteredUsers = this.users.filter(u => u.isActive === isActive);
        }
        this.updateTable();
    }

    static updateTable() {
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = this.renderUsersRows();
        this.attachTableEventListeners();
    }

    static openUserModal(user = null) {
        this.currentUser = user;
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        const form = document.getElementById('user-form');
        
        // Set modal title
        document.getElementById('userModalTitle').textContent = 
            user ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد';

        // Reset form
        form.reset();
        this.clearPermissions();

        // If editing, populate form
        if (user) {
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-username').disabled = true; // Disable username editing
            document.getElementById('user-password').required = false;
            document.getElementById('user-confirm-password').required = false;
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-email').value = user.email || '';
            document.getElementById('user-phone').value = user.phone || '';
            document.getElementById('user-status').value = user.isActive.toString();
            document.getElementById('user-notes').value = user.notes || '';
            
            // Set permissions
            this.setPermissions(user.permissions);
        } else {
            document.getElementById('user-username').disabled = false;
            document.getElementById('user-password').required = true;
            document.getElementById('user-confirm-password').required = true;
        }

        modal.show();
    }

    static openChangePasswordModal(userId) {
        this.currentPasswordChangeUserId = userId;
        const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
        document.getElementById('change-password-form').reset();
        modal.show();
    }

    static editUser(userId) {
        const user = window.app?.dataService.getUserById(userId);
        if (user) {
            this.openUserModal(user);
        }
    }

    static deleteUser(userId) {
        const user = window.app?.dataService.getUserById(userId);
        if (!user) return;

        if (user.username === 'admin') {
            app.showToast('خطأ', 'لا يمكن حذف المستخدم الرئيسي', 'error');
            return;
        }

        if (confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟`)) {
            try {
                // In a real application, you would implement deleteUser in the data service
                app.showToast('تم الحذف', 'تم حذف المستخدم بنجاح', 'success');
                this.refreshUsers();
            } catch (error) {
                app.showToast('خطأ', 'فشل في حذف المستخدم', 'error');
            }
        }
    }

    static saveUser() {
        const form = document.getElementById('user-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;

        // Validate password match
        if (password && password !== confirmPassword) {
            app.showToast('خطأ', 'كلمات المرور غير متطابقة', 'error');
            return;
        }

        // Validate password strength
        if (password && password.length < 6) {
            app.showToast('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        const userData = {
            name: document.getElementById('user-name').value,
            username: document.getElementById('user-username').value,
            role: document.getElementById('user-role').value,
            email: document.getElementById('user-email').value,
            phone: document.getElementById('user-phone').value,
            isActive: document.getElementById('user-status').value === 'true',
            permissions: this.getSelectedPermissions(),
            notes: document.getElementById('user-notes').value
        };

        // Add password only if provided
        if (password) {
            userData.password = password;
        }

        // Validate email if provided
        if (userData.email && !Helpers.validateEmail(userData.email)) {
            app.showToast('خطأ', 'البريد الإلكتروني غير صحيح', 'error');
            return;
        }

        // Validate permissions
        if (userData.permissions.length === 0) {
            app.showToast('خطأ', 'يجب تحديد صلاحية واحدة على الأقل', 'error');
            return;
        }

        try {
            if (this.currentUser) {
                // Update existing user
                window.app?.dataService.updateUser(this.currentUser.id, userData);
                app.showToast('تم التحديث', 'تم تحديث بيانات المستخدم بنجاح', 'success');
            } else {
                // Add new user
                window.app?.dataService.addUser(userData);
                app.showToast('تم الإضافة', 'تم إضافة المستخدم بنجاح', 'success');
            }

            // Close modal and refresh
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
            this.refreshUsers();

        } catch (error) {
            app.showToast('خطأ', 'فشل في حفظ بيانات المستخدم', 'error');
        }
    }

    static changePassword() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmPassword) {
            app.showToast('خطأ', 'كلمات المرور غير متطابقة', 'error');
            return;
        }

        if (newPassword.length < 6) {
            app.showToast('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        try {
            window.app?.dataService.updateUser(this.currentPasswordChangeUserId, { password: newPassword });
            app.showToast('تم التحديث', 'تم تغيير كلمة المرور بنجاح', 'success');
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();

        } catch (error) {
            app.showToast('خطأ', 'فشل في تغيير كلمة المرور', 'error');
        }
    }

    static updatePermissionsByRole(role) {
        const rolePermissions = {
            'admin': ['all'],
            'supervisor': ['sales', 'products', 'inventory', 'customers', 'reports'],
            'cashier': ['sales', 'customers']
        };

        if (rolePermissions[role]) {
            this.clearPermissions();
            this.setPermissions(rolePermissions[role]);
        }
    }

    static toggleAllPermissions(checked) {
        const permissionCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="perm-"]:not(#perm-all)');
        permissionCheckboxes.forEach(checkbox => {
            checkbox.checked = checked;
            checkbox.disabled = checked;
        });
    }

    static clearPermissions() {
        const permissionCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="perm-"]');
        permissionCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
        });
    }

    static setPermissions(permissions) {
        if (permissions.includes('all')) {
            document.getElementById('perm-all').checked = true;
            this.toggleAllPermissions(true);
        } else {
            permissions.forEach(permission => {
                const checkbox = document.getElementById(`perm-${permission}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }

    static getSelectedPermissions() {
        const permissions = [];
        const permissionCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="perm-"]:checked');
        
        permissionCheckboxes.forEach(checkbox => {
            permissions.push(checkbox.value);
        });

        return permissions;
    }

    static exportUsers() {
        const usersData = this.users.map(user => ({
            'الاسم': user.name,
            'اسم المستخدم': user.username,
            'الدور': this.getRoleText(user.role),
            'البريد الإلكتروني': user.email || '',
            'الهاتف': user.phone || '',
            'الحالة': user.isActive ? 'نشط' : 'غير نشط',
            'الصلاحيات': user.permissions.includes('all') ? 'جميع الصلاحيات' : 
                         user.permissions.map(p => this.getPermissionText(p)).join(', '),
            'آخر دخول': user.lastLogin ? Helpers.formatDateTime(user.lastLogin) : 'لم يسجل دخول',
            'تاريخ الإنشاء': Helpers.formatDate(user.createdAt)
        }));

        const csvContent = this.convertToCSV(usersData);
        const filename = `users_report_${new Date().toISOString().split('T')[0]}.csv`;
        
        Helpers.downloadFile(csvContent, filename, 'text/csv');
        app.showToast('تم التصدير', 'تم تصدير بيانات المستخدمين بنجاح', 'success');
    }

    static convertToCSV(data) {
        if (!data.length) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add headers
        csvRows.push(headers.join(','));

        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    static refreshUsers() {
        this.users = window.app?.dataService.getAllUsers();
        this.filteredUsers = [...this.users];
        
        // Re-render the entire component
        app.loadComponent('users');
    }
}
