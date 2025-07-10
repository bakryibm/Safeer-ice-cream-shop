// Settings Management Window Component
class SettingsWindow {
    static settings = {};
    static originalSettings = {};

    static async render() {
        this.settings = window.app?.dataService.getSettings();
        this.originalSettings = Helpers.deepClone(this.settings);

        return `
            <div class="settings-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-cog me-2"></i>
                            إعدادات النظام
                        </h1>
                        <p class="text-muted">إدارة إعدادات المحل والنظام</p>
                    </div>
                </div>

                <!-- Settings Tabs -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <ul class="nav nav-tabs" id="settingsTabs" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link active" id="general-tab" data-bs-toggle="tab" 
                                                data-bs-target="#general" type="button" role="tab">
                                            <i class="fas fa-store me-2"></i>
                                            إعدادات عامة
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="receipt-tab" data-bs-toggle="tab" 
                                                data-bs-target="#receipt" type="button" role="tab">
                                            <i class="fas fa-receipt me-2"></i>
                                            إعدادات الفاتورة
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="system-tab" data-bs-toggle="tab" 
                                                data-bs-target="#system" type="button" role="tab">
                                            <i class="fas fa-server me-2"></i>
                                            إعدادات النظام
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="backup-tab" data-bs-toggle="tab" 
                                                data-bs-target="#backup" type="button" role="tab">
                                            <i class="fas fa-database me-2"></i>
                                            النسخ الاحتياطي
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="tab-content" id="settingsTabContent">
                    <!-- General Settings -->
                    <div class="tab-pane fade show active" id="general" role="tabpanel">
                        <div class="row">
                            <div class="col-lg-8">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-store me-2"></i>
                                            معلومات المحل
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <form id="general-settings-form">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">اسم المحل (عربي)</label>
                                                        <input type="text" class="form-control" id="shop-name" 
                                                               value="${this.settings.shopName || ''}" required>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">اسم المحل (إنجليزي)</label>
                                                        <input type="text" class="form-control" id="shop-name-en" 
                                                               value="${this.settings.shopNameEn || ''}">
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">العملة</label>
                                                        <select class="form-select" id="currency">
                                                            <option value="OMR" ${this.settings.currency === 'OMR' ? 'selected' : ''}>ريال عماني (OMR)</option>
                                                            <option value="AED" ${this.settings.currency === 'AED' ? 'selected' : ''}>درهم إماراتي (AED)</option>
                                                            <option value="SAR" ${this.settings.currency === 'SAR' ? 'selected' : ''}>ريال سعودي (SAR)</option>
                                                            <option value="USD" ${this.settings.currency === 'USD' ? 'selected' : ''}>دولار أمريكي (USD)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">رمز العملة</label>
                                                        <input type="text" class="form-control" id="currency-symbol" 
                                                               value="${this.settings.currencySymbol || 'ر.ع'}" required>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">معدل الضريبة (%)</label>
                                                        <input type="number" class="form-control" id="tax-rate" 
                                                               value="${(this.settings.taxRate || 0) * 100}" 
                                                               min="0" max="100" step="0.1">
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">اللغة الافتراضية</label>
                                                        <select class="form-select" id="default-language">
                                                            <option value="ar" ${this.settings.language === 'ar' ? 'selected' : ''}>العربية</option>
                                                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">عنوان المحل</label>
                                                <textarea class="form-control" id="shop-address" rows="3">${this.settings.shopAddress || ''}</textarea>
                                            </div>

                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">رقم الهاتف</label>
                                                        <input type="tel" class="form-control" id="shop-phone" 
                                                               value="${this.settings.shopPhone || ''}">
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">البريد الإلكتروني</label>
                                                        <input type="email" class="form-control" id="shop-email" 
                                                               value="${this.settings.shopEmail || ''}">
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-bell me-2"></i>
                                            إعدادات التنبيهات
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="low-stock-alert" 
                                                   ${this.settings.lowStockAlert ? 'checked' : ''}>
                                            <label class="form-check-label" for="low-stock-alert">
                                                تنبيهات المخزون المنخفض
                                            </label>
                                        </div>

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="auto-backup" 
                                                   ${this.settings.autoBackup ? 'checked' : ''}>
                                            <label class="form-check-label" for="auto-backup">
                                                النسخ الاحتياطي التلقائي
                                            </label>
                                        </div>

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="sound-notifications" 
                                                   ${this.settings.soundNotifications ? 'checked' : ''}>
                                            <label class="form-check-label" for="sound-notifications">
                                                التنبيهات الصوتية
                                            </label>
                                        </div>

                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="email-reports" 
                                                   ${this.settings.emailReports ? 'checked' : ''}>
                                            <label class="form-check-label" for="email-reports">
                                                إرسال التقارير بالبريد
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Receipt Settings -->
                    <div class="tab-pane fade" id="receipt" role="tabpanel">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-receipt me-2"></i>
                                            إعدادات الفاتورة
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <form id="receipt-settings-form">
                                            <div class="mb-3">
                                                <label class="form-label">رأس الفاتورة</label>
                                                <input type="text" class="form-control" id="receipt-header" 
                                                       value="${this.settings.receiptHeader || ''}" required>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">ذيل الفاتورة</label>
                                                <textarea class="form-control" id="receipt-footer" rows="3">${this.settings.receiptFooter || ''}</textarea>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">حجم الخط</label>
                                                <select class="form-select" id="receipt-font-size">
                                                    <option value="12" ${this.settings.receiptFontSize === 12 ? 'selected' : ''}>صغير (12px)</option>
                                                    <option value="14" ${this.settings.receiptFontSize === 14 ? 'selected' : ''}>متوسط (14px)</option>
                                                    <option value="16" ${this.settings.receiptFontSize === 16 ? 'selected' : ''}>كبير (16px)</option>
                                                </select>
                                            </div>

                                            <div class="form-check form-switch mb-3">
                                                <input class="form-check-input" type="checkbox" id="print-logo" 
                                                       ${this.settings.printLogo ? 'checked' : ''}>
                                                <label class="form-check-label" for="print-logo">
                                                    طباعة الشعار
                                                </label>
                                            </div>

                                            <div class="form-check form-switch mb-3">
                                                <input class="form-check-input" type="checkbox" id="auto-print" 
                                                       ${this.settings.autoPrint ? 'checked' : ''}>
                                                <label class="form-check-label" for="auto-print">
                                                    طباعة تلقائية بعد البيع
                                                </label>
                                            </div>

                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="show-customer-info" 
                                                       ${this.settings.showCustomerInfo ? 'checked' : ''}>
                                                <label class="form-check-label" for="show-customer-info">
                                                    عرض معلومات العميل
                                                </label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-eye me-2"></i>
                                            معاينة الفاتورة
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="receipt-preview" id="receipt-preview">
                                            ${this.generateReceiptPreview()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Settings -->
                    <div class="tab-pane fade" id="system" role="tabpanel">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-server me-2"></i>
                                            إعدادات النظام
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label class="form-label">فترة انتهاء الجلسة (دقيقة)</label>
                                            <input type="number" class="form-control" id="session-timeout" 
                                                   value="${this.settings.sessionTimeout || 60}" min="5" max="480">
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">عدد النسخ الاحتياطية المحفوظة</label>
                                            <input type="number" class="form-control" id="backup-retention" 
                                                   value="${this.settings.backupRetention || 7}" min="1" max="30">
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">حجم صفحة التقارير</label>
                                            <select class="form-select" id="report-page-size">
                                                <option value="10" ${this.settings.reportPageSize === 10 ? 'selected' : ''}>10 عناصر</option>
                                                <option value="25" ${this.settings.reportPageSize === 25 ? 'selected' : ''}>25 عنصر</option>
                                                <option value="50" ${this.settings.reportPageSize === 50 ? 'selected' : ''}>50 عنصر</option>
                                                <option value="100" ${this.settings.reportPageSize === 100 ? 'selected' : ''}>100 عنصر</option>
                                            </select>
                                        </div>

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="enable-logging" 
                                                   ${this.settings.enableLogging ? 'checked' : ''}>
                                            <label class="form-check-label" for="enable-logging">
                                                تفعيل سجل العمليات
                                            </label>
                                        </div>

                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="dark-mode" 
                                                   ${this.settings.darkMode ? 'checked' : ''}>
                                            <label class="form-check-label" for="dark-mode">
                                                الوضع الليلي
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-shield-alt me-2"></i>
                                            إعدادات الأمان
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label class="form-label">الحد الأدنى لطول كلمة المرور</label>
                                            <input type="number" class="form-control" id="min-password-length" 
                                                   value="${this.settings.minPasswordLength || 6}" min="4" max="20">
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">عدد محاولات تسجيل الدخول</label>
                                            <input type="number" class="form-control" id="max-login-attempts" 
                                                   value="${this.settings.maxLoginAttempts || 3}" min="1" max="10">
                                        </div>

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="require-strong-password" 
                                                   ${this.settings.requireStrongPassword ? 'checked' : ''}>
                                            <label class="form-check-label" for="require-strong-password">
                                                طلب كلمة مرور قوية
                                            </label>
                                        </div>

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="two-factor-auth" 
                                                   ${this.settings.twoFactorAuth ? 'checked' : ''}>
                                            <label class="form-check-label" for="two-factor-auth">
                                                المصادقة الثنائية
                                            </label>
                                        </div>

                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="audit-trail" 
                                                   ${this.settings.auditTrail ? 'checked' : ''}>
                                            <label class="form-check-label" for="audit-trail">
                                                سجل المراجعة
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Backup Settings -->
                    <div class="tab-pane fade" id="backup" role="tabpanel">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-save me-2"></i>
                                            إنشاء نسخة احتياطية
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="text-muted mb-3">
                                            إنشاء نسخة احتياطية من جميع بيانات النظام
                                        </p>
                                        
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-primary" id="create-backup-btn">
                                                <i class="fas fa-download me-2"></i>
                                                إنشاء نسخة احتياطية الآن
                                            </button>
                                            
                                            <button class="btn btn-success" id="export-all-data-btn">
                                                <i class="fas fa-file-export me-2"></i>
                                                تصدير جميع البيانات
                                            </button>
                                        </div>

                                        <hr>

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="auto-backup-daily" 
                                                   ${this.settings.autoBackupDaily ? 'checked' : ''}>
                                            <label class="form-check-label" for="auto-backup-daily">
                                                نسخ احتياطي يومي تلقائي
                                            </label>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">وقت النسخ الاحتياطي التلقائي</label>
                                            <input type="time" class="form-control" id="backup-time" 
                                                   value="${this.settings.backupTime || '02:00'}">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-upload me-2"></i>
                                            استعادة البيانات
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="text-muted mb-3">
                                            استعادة البيانات من نسخة احتياطية سابقة
                                        </p>

                                        <div class="mb-3">
                                            <label class="form-label">اختر ملف النسخة الاحتياطية</label>
                                            <input type="file" class="form-control" id="backup-file" 
                                                   accept=".json,.csv">
                                        </div>

                                        <div class="d-grid gap-2">
                                            <button class="btn btn-warning" id="restore-backup-btn" disabled>
                                                <i class="fas fa-upload me-2"></i>
                                                استعادة النسخة الاحتياطية
                                            </button>
                                        </div>

                                        <div class="alert alert-warning mt-3">
                                            <i class="fas fa-exclamation-triangle me-2"></i>
                                            <strong>تحذير:</strong> ستقوم عملية الاستعادة بحذف جميع البيانات الحالية واستبدالها بالبيانات من النسخة الاحتياطية.
                                        </div>
                                    </div>
                                </div>

                                <div class="card mt-4">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="fas fa-trash me-2"></i>
                                            إعادة تعيين النظام
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="text-muted mb-3">
                                            حذف جميع البيانات وإعادة النظام للإعدادات الافتراضية
                                        </p>

                                        <button class="btn btn-danger" id="reset-system-btn">
                                            <i class="fas fa-trash me-2"></i>
                                            إعادة تعيين النظام
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Save Changes Button -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small class="text-muted">
                                            آخر حفظ: ${this.settings.lastSaved ? Helpers.formatDateTime(this.settings.lastSaved) : 'لم يتم الحفظ بعد'}
                                        </small>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-outline-secondary" id="reset-settings-btn">
                                            <i class="fas fa-undo me-2"></i>
                                            إلغاء التغييرات
                                        </button>
                                        <button class="btn btn-success" id="save-settings-btn">
                                            <i class="fas fa-save me-2"></i>
                                            حفظ جميع الإعدادات
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static generateReceiptPreview() {
        return `
            <div class="receipt-preview-content" style="font-family: monospace; border: 1px solid #ddd; padding: 15px; background: white;">
                <div class="text-center mb-3">
                    <h4>${this.settings.receiptHeader || 'محل الآيس كريم الذهبي'}</h4>
                    <small>${this.settings.shopAddress || 'العنوان غير محدد'}</small><br>
                    <small>${this.settings.shopPhone || 'الهاتف غير محدد'}</small>
                </div>
                
                <hr>
                
                <div class="mb-2">
                    <strong>رقم المعاملة:</strong> TXN000123<br>
                    <strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-OM')}<br>
                    <strong>الوقت:</strong> ${new Date().toLocaleTimeString('ar-OM')}
                </div>
                
                <hr>
                
                <div class="mb-2">
                    <div class="d-flex justify-content-between">
                        <span>آيس كريم الفانيليا × 2</span>
                        <span>3.000 ${this.settings.currencySymbol || 'ر.ع'}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>آيس كريم الشوكولاتة × 1</span>
                        <span>1.750 ${this.settings.currencySymbol || 'ر.ع'}</span>
                    </div>
                </div>
                
                <hr>
                
                <div class="mb-2">
                    <div class="d-flex justify-content-between">
                        <span>المجموع الجزئي:</span>
                        <span>4.750 ${this.settings.currencySymbol || 'ر.ع'}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>الضريبة (${((this.settings.taxRate || 0) * 100).toFixed(1)}%):</span>
                        <span>0.238 ${this.settings.currencySymbol || 'ر.ع'}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <strong>الإجمالي:</strong>
                        <strong>4.988 ${this.settings.currencySymbol || 'ر.ع'}</strong>
                    </div>
                </div>
                
                <hr>
                
                <div class="text-center">
                    <small>${this.settings.receiptFooter || 'شكراً لزيارتكم'}</small>
                </div>
            </div>
        `;
    }

    static init() {
        this.setupEventListeners();
        this.updateReceiptPreview();
    }

    static setupEventListeners() {
        // Save settings button
        const saveBtn = document.getElementById('save-settings-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveAllSettings();
            });
        }

        // Reset settings button
        const resetBtn = document.getElementById('reset-settings-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        // Receipt preview updates
        const receiptInputs = [
            'receipt-header', 'receipt-footer', 'shop-address', 
            'shop-phone', 'currency-symbol', 'tax-rate'
        ];
        
        receiptInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateReceiptPreview();
                });
            }
        });

        // Backup and restore functionality
        this.setupBackupEventListeners();

        // System reset
        const resetSystemBtn = document.getElementById('reset-system-btn');
        if (resetSystemBtn) {
            resetSystemBtn.addEventListener('click', () => {
                this.resetSystem();
            });
        }

        // Currency change handler
        const currencySelect = document.getElementById('currency');
        if (currencySelect) {
            currencySelect.addEventListener('change', (e) => {
                this.updateCurrencySymbol(e.target.value);
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }
    }

    static setupBackupEventListeners() {
        // Create backup
        const createBackupBtn = document.getElementById('create-backup-btn');
        if (createBackupBtn) {
            createBackupBtn.addEventListener('click', () => {
                this.createBackup();
            });
        }

        // Export all data
        const exportAllBtn = document.getElementById('export-all-data-btn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => {
                this.exportAllData();
            });
        }

        // Backup file selection
        const backupFileInput = document.getElementById('backup-file');
        if (backupFileInput) {
            backupFileInput.addEventListener('change', (e) => {
                const restoreBtn = document.getElementById('restore-backup-btn');
                restoreBtn.disabled = !e.target.files.length;
            });
        }

        // Restore backup
        const restoreBtn = document.getElementById('restore-backup-btn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => {
                this.restoreBackup();
            });
        }
    }

    static updateReceiptPreview() {
        // Get current values from form
        const receiptHeader = document.getElementById('receipt-header')?.value || this.settings.receiptHeader;
        const receiptFooter = document.getElementById('receipt-footer')?.value || this.settings.receiptFooter;
        const shopAddress = document.getElementById('shop-address')?.value || this.settings.shopAddress;
        const shopPhone = document.getElementById('shop-phone')?.value || this.settings.shopPhone;
        const currencySymbol = document.getElementById('currency-symbol')?.value || this.settings.currencySymbol;
        const taxRate = parseFloat(document.getElementById('tax-rate')?.value || 0) / 100;

        // Update preview
        const preview = document.getElementById('receipt-preview');
        if (preview) {
            preview.innerHTML = `
                <div class="receipt-preview-content" style="font-family: monospace; border: 1px solid #ddd; padding: 15px; background: white;">
                    <div class="text-center mb-3">
                        <h4>${receiptHeader || 'محل الآيس كريم الذهبي'}</h4>
                        <small>${shopAddress || 'العنوان غير محدد'}</small><br>
                        <small>${shopPhone || 'الهاتف غير محدد'}</small>
                    </div>
                    
                    <hr>
                    
                    <div class="mb-2">
                        <strong>رقم المعاملة:</strong> TXN000123<br>
                        <strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-OM')}<br>
                        <strong>الوقت:</strong> ${new Date().toLocaleTimeString('ar-OM')}
                    </div>
                    
                    <hr>
                    
                    <div class="mb-2">
                        <div class="d-flex justify-content-between">
                            <span>آيس كريم الفانيليا × 2</span>
                            <span>3.000 ${currencySymbol || 'ر.ع'}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>آيس كريم الشوكولاتة × 1</span>
                            <span>1.750 ${currencySymbol || 'ر.ع'}</span>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="mb-2">
                        <div class="d-flex justify-content-between">
                            <span>المجموع الجزئي:</span>
                            <span>4.750 ${currencySymbol || 'ر.ع'}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>الضريبة (${(taxRate * 100).toFixed(1)}%):</span>
                            <span>${(4.750 * taxRate).toFixed(3)} ${currencySymbol || 'ر.ع'}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <strong>الإجمالي:</strong>
                            <strong>${(4.750 * (1 + taxRate)).toFixed(3)} ${currencySymbol || 'ر.ع'}</strong>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="text-center">
                        <small>${receiptFooter || 'شكراً لزيارتكم'}</small>
                    </div>
                </div>
            `;
        }
    }

    static updateCurrencySymbol(currency) {
        const symbols = {
            'OMR': 'ر.ع',
            'AED': 'د.إ',
            'SAR': 'ر.س',
            'USD': '$'
        };
        
        const symbolInput = document.getElementById('currency-symbol');
        if (symbolInput && symbols[currency]) {
            symbolInput.value = symbols[currency];
            this.updateReceiptPreview();
        }
    }

    static toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    static saveAllSettings() {
        try {
            // Collect all settings from forms
            const newSettings = {
                // General settings
                shopName: document.getElementById('shop-name').value,
                shopNameEn: document.getElementById('shop-name-en').value,
                currency: document.getElementById('currency').value,
                currencySymbol: document.getElementById('currency-symbol').value,
                taxRate: parseFloat(document.getElementById('tax-rate').value) / 100,
                language: document.getElementById('default-language').value,
                shopAddress: document.getElementById('shop-address').value,
                shopPhone: document.getElementById('shop-phone').value,
                shopEmail: document.getElementById('shop-email').value,

                // Alert settings
                lowStockAlert: document.getElementById('low-stock-alert').checked,
                autoBackup: document.getElementById('auto-backup').checked,
                soundNotifications: document.getElementById('sound-notifications').checked,
                emailReports: document.getElementById('email-reports').checked,

                // Receipt settings
                receiptHeader: document.getElementById('receipt-header').value,
                receiptFooter: document.getElementById('receipt-footer').value,
                receiptFontSize: parseInt(document.getElementById('receipt-font-size').value),
                printLogo: document.getElementById('print-logo').checked,
                autoPrint: document.getElementById('auto-print').checked,
                showCustomerInfo: document.getElementById('show-customer-info').checked,

                // System settings
                sessionTimeout: parseInt(document.getElementById('session-timeout').value),
                backupRetention: parseInt(document.getElementById('backup-retention').value),
                reportPageSize: parseInt(document.getElementById('report-page-size').value),
                enableLogging: document.getElementById('enable-logging').checked,
                darkMode: document.getElementById('dark-mode').checked,

                // Security settings
                minPasswordLength: parseInt(document.getElementById('min-password-length').value),
                maxLoginAttempts: parseInt(document.getElementById('max-login-attempts').value),
                requireStrongPassword: document.getElementById('require-strong-password').checked,
                twoFactorAuth: document.getElementById('two-factor-auth').checked,
                auditTrail: document.getElementById('audit-trail').checked,

                // Backup settings
                autoBackupDaily: document.getElementById('auto-backup-daily').checked,
                backupTime: document.getElementById('backup-time').value,

                // Metadata
                lastSaved: new Date(),
                version: '1.0.0'
            };

            // Validate required fields
            if (!newSettings.shopName || !newSettings.currencySymbol) {
                app.showToast('خطأ', 'يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            // Save settings
            window.app?.dataService.updateSettings(newSettings);
            this.settings = newSettings;
            this.originalSettings = Helpers.deepClone(newSettings);

            app.showToast('تم الحفظ', 'تم حفظ جميع الإعدادات بنجاح', 'success');

        } catch (error) {
            console.error('Error saving settings:', error);
            app.showToast('خطأ', 'فشل في حفظ الإعدادات', 'error');
        }
    }

    static resetSettings() {
        if (confirm('هل أنت متأكد من إلغاء جميع التغييرات؟')) {
            // Restore original settings values to form
            this.populateForm(this.originalSettings);
            this.updateReceiptPreview();
            app.showToast('تم الإلغاء', 'تم إلغاء جميع التغييرات', 'info');
        }
    }

    static populateForm(settings) {
        // General settings
        document.getElementById('shop-name').value = settings.shopName || '';
        document.getElementById('shop-name-en').value = settings.shopNameEn || '';
        document.getElementById('currency').value = settings.currency || 'OMR';
        document.getElementById('currency-symbol').value = settings.currencySymbol || 'ر.ع';
        document.getElementById('tax-rate').value = (settings.taxRate || 0) * 100;
        document.getElementById('default-language').value = settings.language || 'ar';
        document.getElementById('shop-address').value = settings.shopAddress || '';
        document.getElementById('shop-phone').value = settings.shopPhone || '';
        document.getElementById('shop-email').value = settings.shopEmail || '';

        // Alert settings
        document.getElementById('low-stock-alert').checked = settings.lowStockAlert || false;
        document.getElementById('auto-backup').checked = settings.autoBackup || false;
        document.getElementById('sound-notifications').checked = settings.soundNotifications || false;
        document.getElementById('email-reports').checked = settings.emailReports || false;

        // Receipt settings
        document.getElementById('receipt-header').value = settings.receiptHeader || '';
        document.getElementById('receipt-footer').value = settings.receiptFooter || '';
        document.getElementById('receipt-font-size').value = settings.receiptFontSize || 14;
        document.getElementById('print-logo').checked = settings.printLogo || false;
        document.getElementById('auto-print').checked = settings.autoPrint || false;
        document.getElementById('show-customer-info').checked = settings.showCustomerInfo || false;

        // System settings
        document.getElementById('session-timeout').value = settings.sessionTimeout || 60;
        document.getElementById('backup-retention').value = settings.backupRetention || 7;
        document.getElementById('report-page-size').value = settings.reportPageSize || 25;
        document.getElementById('enable-logging').checked = settings.enableLogging || false;
        document.getElementById('dark-mode').checked = settings.darkMode || false;

        // Security settings
        document.getElementById('min-password-length').value = settings.minPasswordLength || 6;
        document.getElementById('max-login-attempts').value = settings.maxLoginAttempts || 3;
        document.getElementById('require-strong-password').checked = settings.requireStrongPassword || false;
        document.getElementById('two-factor-auth').checked = settings.twoFactorAuth || false;
        document.getElementById('audit-trail').checked = settings.auditTrail || false;

        // Backup settings
        document.getElementById('auto-backup-daily').checked = settings.autoBackupDaily || false;
        document.getElementById('backup-time').value = settings.backupTime || '02:00';
    }

    static createBackup() {
        try {
            window.app?.dataService.exportData();
            app.showToast('تم إنشاء النسخة الاحتياطية', 'تم إنشاء وتحميل النسخة الاحتياطية بنجاح', 'success');
        } catch (error) {
            app.showToast('خطأ', 'فشل في إنشاء النسخة الاحتياطية', 'error');
        }
    }

    static exportAllData() {
        try {
            const allData = {
                products: window.app?.dataService.getAllProducts(),
                sales: window.app?.dataService.getAllSales(),
                customers: window.app?.dataService.getAllCustomers(),
                users: window.app?.dataService.getAllUsers(),
                settings: window.app?.dataService.getSettings(),
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `icecreamshop_complete_export_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            app.showToast('تم التصدير', 'تم تصدير جميع البيانات بنجاح', 'success');
        } catch (error) {
            app.showToast('خطأ', 'فشل في تصدير البيانات', 'error');
        }
    }

    static async restoreBackup() {
        const fileInput = document.getElementById('backup-file');
        const file = fileInput.files[0];
        
        if (!file) {
            app.showToast('خطأ', 'يرجى اختيار ملف النسخة الاحتياطية', 'error');
            return;
        }

        if (!confirm('هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم حذف جميع البيانات الحالية.')) {
            return;
        }

        try {
            const fileContent = await Helpers.readFile(file);
            const success = window.app?.dataService.importData(fileContent);
            
            if (success) {
                app.showToast('تم الاستعادة', 'تم استعادة النسخة الاحتياطية بنجاح', 'success');
                
                // Refresh the page to reflect changes
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                app.showToast('خطأ', 'فشل في استعادة النسخة الاحتياطية - ملف غير صالح', 'error');
            }
        } catch (error) {
            app.showToast('خطأ', 'فشل في قراءة ملف النسخة الاحتياطية', 'error');
        }
    }

    static resetSystem() {
        if (!confirm('هل أنت متأكد من إعادة تعيين النظام؟ سيتم حذف جميع البيانات نهائياً!')) {
            return;
        }

        if (!confirm('هذا الإجراء لا يمكن التراجع عنه. هل تريد المتابعة؟')) {
            return;
        }

        try {
            // Clear all data from localStorage
            localStorage.clear();
            
            app.showToast('تم إعادة التعيين', 'تم إعادة تعيين النظام بنجاح', 'success');
            
            // Refresh the page
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            app.showToast('خطأ', 'فشل في إعادة تعيين النظام', 'error');
        }
    }

    static refresh() {
        this.settings = window.app?.dataService.getSettings();
        this.originalSettings = Helpers.deepClone(this.settings);
        
        // Re-render the entire component
        app.loadComponent('settings');
    }
}
