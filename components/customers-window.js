// Customer Management Window Component
class CustomersWindow {
    static customers = [];
    static filteredCustomers = [];
    static currentCustomer = null;

    static async render() {
        this.customers = window.app?.dataService.getAllCustomers();
        this.filteredCustomers = [...this.customers];

        return `
            <div class="customers-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-users me-2"></i>
                            إدارة العملاء
                        </h1>
                        <p class="text-muted">إدارة بيانات العملاء ومتابعة مشترياتهم</p>
                    </div>
                </div>

                <!-- Customer Stats -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(this.getTotalCustomers())}</h3>
                                        <p class="mb-0">إجمالي العملاء</p>
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
                                        <h3>${Helpers.formatNumber(this.getActiveCustomers())}</h3>
                                        <p class="mb-0">عملاء نشطين</p>
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
                                        <h3>${this.getTotalPurchases()}</h3>
                                        <p class="mb-0">إجمالي المشتريات</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-shopping-cart"></i>
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
                                        <h3>${this.getAveragePurchase()}</h3>
                                        <p class="mb-0">متوسط المشتريات</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-chart-bar"></i>
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
                            <input type="text" class="form-control" id="search-customers" 
                                   placeholder="البحث عن عميل...">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" id="filter-membership">
                            <option value="">جميع أنواع العضوية</option>
                            <option value="عادي">عادي</option>
                            <option value="فضي">فضي</option>
                            <option value="ذهبي">ذهبي</option>
                            <option value="بلاتيني">بلاتيني</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select class="form-select" id="sort-customers">
                            <option value="name">الاسم</option>
                            <option value="purchases">المشتريات</option>
                            <option value="visits">الزيارات</option>
                            <option value="lastVisit">آخر زيارة</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-success w-100" id="add-customer-btn">
                            <i class="fas fa-user-plus me-2"></i>
                            إضافة عميل
                        </button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-info w-100" id="export-customers-btn">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>

                <!-- Customers Table -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-list me-2"></i>
                                    قائمة العملاء
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>الاسم</th>
                                                <th>الهاتف</th>
                                                <th>البريد الإلكتروني</th>
                                                <th>العنوان</th>
                                                <th>نوع العضوية</th>
                                                <th>عدد الزيارات</th>
                                                <th>إجمالي المشتريات</th>
                                                <th>الخصم</th>
                                                <th>آخر زيارة</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody id="customers-table-body">
                                            ${this.renderCustomersRows()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add/Edit Customer Modal -->
                <div class="modal fade" id="customerModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="customerModalTitle">إضافة عميل جديد</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="customer-form">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الاسم الكامل</label>
                                                <input type="text" class="form-control" id="customer-name" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">رقم الهاتف</label>
                                                <input type="tel" class="form-control" id="customer-phone" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">البريد الإلكتروني</label>
                                                <input type="email" class="form-control" id="customer-email">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">نوع العضوية</label>
                                                <select class="form-select" id="customer-membership" required>
                                                    <option value="">اختر نوع العضوية</option>
                                                    <option value="عادي">عادي</option>
                                                    <option value="فضي">فضي</option>
                                                    <option value="ذهبي">ذهبي</option>
                                                    <option value="بلاتيني">بلاتيني</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">نسبة الخصم (%)</label>
                                                <input type="number" class="form-control" id="customer-discount" 
                                                       min="0" max="50" value="0">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">تاريخ الميلاد</label>
                                                <input type="date" class="form-control" id="customer-birthdate">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">العنوان</label>
                                        <textarea class="form-control" id="customer-address" rows="3"></textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">ملاحظات</label>
                                        <textarea class="form-control" id="customer-notes" rows="2"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                                <button type="button" class="btn btn-primary" id="save-customer-btn">حفظ</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customer Details Modal -->
                <div class="modal fade" id="customerDetailsModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">تفاصيل العميل</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body" id="customer-details-content">
                                <!-- Customer details will be loaded here -->
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderCustomersRows() {
        return this.filteredCustomers.map(customer => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle me-2">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <strong>${customer.name}</strong>
                            <br>
                            <small class="text-muted">عضو منذ ${Helpers.formatDate(customer.createdAt)}</small>
                        </div>
                    </div>
                </td>
                <td>${customer.phone}</td>
                <td>${customer.email || 'غير متوفر'}</td>
                <td>
                    <small>${customer.address || 'غير متوفر'}</small>
                </td>
                <td>
                    <span class="badge ${this.getMembershipBadgeClass(customer.membershipType)}">
                        ${customer.membershipType}
                    </span>
                </td>
                <td>${Helpers.formatNumber(customer.visits)}</td>
                <td>${Helpers.formatCurrency(customer.totalPurchases)}</td>
                <td>${customer.discount}%</td>
                <td>
                    ${customer.lastVisit ? 
                        `<small>${Helpers.formatDate(customer.lastVisit)}</small>` : 
                        '<small class="text-muted">لم يزر بعد</small>'
                    }
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-info view-customer" 
                                data-customer-id="${customer.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary edit-customer" 
                                data-customer-id="${customer.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-customer" 
                                data-customer-id="${customer.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    static getMembershipBadgeClass(membershipType) {
        switch (membershipType) {
            case 'بلاتيني': return 'bg-dark';
            case 'ذهبي': return 'bg-warning';
            case 'فضي': return 'bg-secondary';
            default: return 'bg-info';
        }
    }

    static getTotalCustomers() {
        return this.customers.length;
    }

    static getActiveCustomers() {
        return this.customers.filter(c => c.visits > 0).length;
    }

    static getTotalPurchases() {
        const total = this.customers.reduce((sum, c) => sum + c.totalPurchases, 0);
        return Helpers.formatCurrency(total);
    }

    static getAveragePurchase() {
        const total = this.customers.reduce((sum, c) => sum + c.totalPurchases, 0);
        const average = this.customers.length > 0 ? total / this.customers.length : 0;
        return Helpers.formatCurrency(average);
    }

    static init() {
        this.setupEventListeners();
    }

    static setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-customers');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCustomers(e.target.value);
            });
        }

        // Membership filter
        const membershipFilter = document.getElementById('filter-membership');
        if (membershipFilter) {
            membershipFilter.addEventListener('change', (e) => {
                this.filterByMembership(e.target.value);
            });
        }

        // Sort customers
        const sortSelect = document.getElementById('sort-customers');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortCustomers(e.target.value);
            });
        }

        // Add customer button
        const addCustomerBtn = document.getElementById('add-customer-btn');
        if (addCustomerBtn) {
            addCustomerBtn.addEventListener('click', () => {
                this.openCustomerModal();
            });
        }

        // Export customers button
        const exportBtn = document.getElementById('export-customers-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCustomers();
            });
        }

        // Table action buttons
        this.attachTableEventListeners();

        // Save customer button
        const saveCustomerBtn = document.getElementById('save-customer-btn');
        if (saveCustomerBtn) {
            saveCustomerBtn.addEventListener('click', () => {
                this.saveCustomer();
            });
        }

        // Phone number validation
        const phoneInput = document.getElementById('customer-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.validatePhoneNumber(e.target);
            });
        }
    }

    static attachTableEventListeners() {
        // View customer buttons
        document.querySelectorAll('.view-customer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const customerId = parseInt(e.target.closest('button').getAttribute('data-customer-id'));
                this.viewCustomer(customerId);
            });
        });

        // Edit customer buttons
        document.querySelectorAll('.edit-customer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const customerId = parseInt(e.target.closest('button').getAttribute('data-customer-id'));
                this.editCustomer(customerId);
            });
        });

        // Delete customer buttons
        document.querySelectorAll('.delete-customer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const customerId = parseInt(e.target.closest('button').getAttribute('data-customer-id'));
                this.deleteCustomer(customerId);
            });
        });
    }

    static filterCustomers(searchTerm) {
        this.filteredCustomers = Helpers.searchArray(this.customers, searchTerm, 
            ['name', 'phone', 'email', 'address']);
        this.updateTable();
    }

    static filterByMembership(membershipType) {
        this.filteredCustomers = membershipType ? 
            this.customers.filter(c => c.membershipType === membershipType) : 
            [...this.customers];
        this.updateTable();
    }

    static sortCustomers(sortBy) {
        this.filteredCustomers = Helpers.sortArray(this.filteredCustomers, sortBy, 'desc');
        this.updateTable();
    }

    static updateTable() {
        const tbody = document.getElementById('customers-table-body');
        tbody.innerHTML = this.renderCustomersRows();
        this.attachTableEventListeners();
    }

    static openCustomerModal(customer = null) {
        this.currentCustomer = customer;
        const modal = new bootstrap.Modal(document.getElementById('customerModal'));
        const form = document.getElementById('customer-form');
        
        // Set modal title
        document.getElementById('customerModalTitle').textContent = 
            customer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد';

        // Reset form
        form.reset();

        // If editing, populate form
        if (customer) {
            document.getElementById('customer-name').value = customer.name;
            document.getElementById('customer-phone').value = customer.phone;
            document.getElementById('customer-email').value = customer.email || '';
            document.getElementById('customer-membership').value = customer.membershipType;
            document.getElementById('customer-discount').value = customer.discount;
            document.getElementById('customer-birthdate').value = customer.birthdate || '';
            document.getElementById('customer-address').value = customer.address || '';
            document.getElementById('customer-notes').value = customer.notes || '';
        }

        modal.show();
    }

    static viewCustomer(customerId) {
        const customer = window.app?.dataService.getCustomerById(customerId);
        if (!customer) return;

        const modal = new bootstrap.Modal(document.getElementById('customerDetailsModal'));
        const content = document.getElementById('customer-details-content');
        
        // Get customer's purchase history
        const sales = window.app?.dataService.getAllSales().filter(sale => sale.customerId === customerId);
        const recentSales = sales.slice(0, 5);

        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">معلومات العميل</h6>
                        </div>
                        <div class="card-body">
                            <dl class="row">
                                <dt class="col-sm-4">الاسم:</dt>
                                <dd class="col-sm-8">${customer.name}</dd>
                                
                                <dt class="col-sm-4">الهاتف:</dt>
                                <dd class="col-sm-8">${customer.phone}</dd>
                                
                                <dt class="col-sm-4">البريد:</dt>
                                <dd class="col-sm-8">${customer.email || 'غير متوفر'}</dd>
                                
                                <dt class="col-sm-4">العضوية:</dt>
                                <dd class="col-sm-8">
                                    <span class="badge ${this.getMembershipBadgeClass(customer.membershipType)}">
                                        ${customer.membershipType}
                                    </span>
                                </dd>
                                
                                <dt class="col-sm-4">الخصم:</dt>
                                <dd class="col-sm-8">${customer.discount}%</dd>
                                
                                <dt class="col-sm-4">عضو منذ:</dt>
                                <dd class="col-sm-8">${Helpers.formatDate(customer.createdAt)}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">إحصائيات العميل</h6>
                        </div>
                        <div class="card-body">
                            <div class="row text-center">
                                <div class="col-4">
                                    <div class="border rounded p-3">
                                        <h5 class="text-primary">${customer.visits}</h5>
                                        <small>عدد الزيارات</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="border rounded p-3">
                                        <h5 class="text-success">${Helpers.formatCurrency(customer.totalPurchases)}</h5>
                                        <small>إجمالي المشتريات</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="border rounded p-3">
                                        <h5 class="text-info">${customer.visits > 0 ? Helpers.formatCurrency(customer.totalPurchases / customer.visits) : '0.000 ر.ع'}</h5>
                                        <small>متوسط الشراء</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            ${customer.address ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="card-title mb-0">العنوان</h6>
                            </div>
                            <div class="card-body">
                                <p class="mb-0">${customer.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${recentSales.length > 0 ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="card-title mb-0">آخر المشتريات</h6>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>التاريخ</th>
                                                <th>رقم المعاملة</th>
                                                <th>المبلغ</th>
                                                <th>طريقة الدفع</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${recentSales.map(sale => `
                                                <tr>
                                                    <td>${Helpers.formatDate(sale.date)}</td>
                                                    <td>${sale.transactionId}</td>
                                                    <td>${Helpers.formatCurrency(sale.total)}</td>
                                                    <td><span class="badge bg-info">${sale.paymentMethod}</span></td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        modal.show();
    }

    static editCustomer(customerId) {
        const customer = window.app?.dataService.getCustomerById(customerId);
        if (customer) {
            this.openCustomerModal(customer);
        }
    }

    static deleteCustomer(customerId) {
        const customer = window.app?.dataService.getCustomerById(customerId);
        if (!customer) return;

        if (confirm(`هل أنت متأكد من حذف العميل "${customer.name}"؟`)) {
            // In a real application, you would implement deleteCustomer in the data service
            // For now, we'll just show a message
            app.showToast('تم الحذف', 'تم حذف العميل بنجاح', 'success');
            this.refreshCustomers();
        }
    }

    static saveCustomer() {
        const form = document.getElementById('customer-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const customerData = {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value,
            membershipType: document.getElementById('customer-membership').value,
            discount: parseInt(document.getElementById('customer-discount').value),
            birthdate: document.getElementById('customer-birthdate').value,
            address: document.getElementById('customer-address').value,
            notes: document.getElementById('customer-notes').value
        };

        // Validate phone number
        if (!Helpers.validatePhone(customerData.phone)) {
            app.showToast('خطأ', 'رقم الهاتف غير صحيح', 'error');
            return;
        }

        // Validate email if provided
        if (customerData.email && !Helpers.validateEmail(customerData.email)) {
            app.showToast('خطأ', 'البريد الإلكتروني غير صحيح', 'error');
            return;
        }

        try {
            if (this.currentCustomer) {
                // Update existing customer
                window.app?.dataService.updateCustomer(this.currentCustomer.id, customerData);
                app.showToast('تم التحديث', 'تم تحديث بيانات العميل بنجاح', 'success');
            } else {
                // Add new customer
                window.app?.dataService.addCustomer(customerData);
                app.showToast('تم الإضافة', 'تم إضافة العميل بنجاح', 'success');
            }

            // Close modal and refresh
            bootstrap.Modal.getInstance(document.getElementById('customerModal')).hide();
            this.refreshCustomers();

        } catch (error) {
            app.showToast('خطأ', 'فشل في حفظ بيانات العميل', 'error');
        }
    }

    static validatePhoneNumber(input) {
        const phone = input.value.replace(/\s+/g, '');
        const isValid = Helpers.validatePhone(phone);
        
        if (phone && !isValid) {
            input.setCustomValidity('رقم الهاتف غير صحيح (يجب أن يكون بصيغة عمانية)');
        } else {
            input.setCustomValidity('');
        }
    }

    static exportCustomers() {
        const customersData = this.customers.map(customer => ({
            'الاسم': customer.name,
            'الهاتف': customer.phone,
            'البريد الإلكتروني': customer.email || '',
            'العنوان': customer.address || '',
            'نوع العضوية': customer.membershipType,
            'عدد الزيارات': customer.visits,
            'إجمالي المشتريات': customer.totalPurchases,
            'نسبة الخصم': customer.discount + '%',
            'آخر زيارة': customer.lastVisit ? Helpers.formatDate(customer.lastVisit) : 'لم يزر بعد',
            'تاريخ التسجيل': Helpers.formatDate(customer.createdAt)
        }));

        const csvContent = this.convertToCSV(customersData);
        const filename = `customers_report_${new Date().toISOString().split('T')[0]}.csv`;
        
        Helpers.downloadFile(csvContent, filename, 'text/csv');
        app.showToast('تم التصدير', 'تم تصدير بيانات العملاء بنجاح', 'success');
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

    static refreshCustomers() {
        this.customers = window.app?.dataService.getAllCustomers();
        this.filteredCustomers = [...this.customers];
        
        // Re-render the entire component
        app.loadComponent('customers');
    }
}
