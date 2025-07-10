// Inventory Management Window Component
class InventoryWindow {
    static inventory = [];
    static filteredInventory = [];
    static currentTransaction = null;

    static async render() {
        this.inventory = app.dataService.getAllProducts();
        this.filteredInventory = [...this.inventory];

        return `
            <div class="inventory-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-boxes me-2"></i>
                            إدارة المخزون
                        </h1>
                        <p class="text-muted">متابعة الكميات والمخزون وإدارة العمليات</p>
                    </div>
                </div>

                <!-- Inventory Summary Cards -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${this.getTotalItems()}</h3>
                                        <p class="mb-0">إجمالي المنتجات</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-boxes"></i>
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
                                        <h3>${this.getTotalValue()}</h3>
                                        <p class="mb-0">قيمة المخزون</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-dollar-sign"></i>
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
                                        <h3>${this.getLowStockCount()}</h3>
                                        <p class="mb-0">مخزون منخفض</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-exclamation-triangle"></i>
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
                                        <h3>${this.getOutOfStockCount()}</h3>
                                        <p class="mb-0">نفد المخزون</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-times-circle"></i>
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
                            <input type="text" class="form-control" id="search-inventory" 
                                   placeholder="البحث في المخزون...">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" id="filter-stock-status">
                            <option value="">جميع الحالات</option>
                            <option value="in-stock">متوفر</option>
                            <option value="low-stock">مخزون منخفض</option>
                            <option value="out-of-stock">نفد المخزون</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-success w-100" id="add-stock-btn">
                            <i class="fas fa-plus me-2"></i>
                            إضافة مخزون
                        </button>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-warning w-100" id="adjust-stock-btn">
                            <i class="fas fa-edit me-2"></i>
                            تعديل مخزون
                        </button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-info w-100" id="export-inventory-btn">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>

                <!-- Low Stock Alerts -->
                ${this.getLowStockCount() > 0 ? `
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="alert alert-warning">
                                <h5 class="alert-heading">
                                    <i class="fas fa-exclamation-triangle me-2"></i>
                                    تنبيهات المخزون المنخفض
                                </h5>
                                <div class="row">
                                    ${this.getLowStockProducts().map(product => `
                                        <div class="col-md-6 col-lg-4 mb-2">
                                            <div class="d-flex align-items-center">
                                                <span class="me-2">${product.image}</span>
                                                <div>
                                                    <strong>${product.name}</strong><br>
                                                    <small class="text-muted">المتوفر: ${product.stock} - الحد الأدنى: ${product.minStock}</small>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Inventory Table -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-list me-2"></i>
                                    تفاصيل المخزون
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>المنتج</th>
                                                <th>الفئة</th>
                                                <th>الكمية المتوفرة</th>
                                                <th>الحد الأدنى</th>
                                                <th>التكلفة/وحدة</th>
                                                <th>القيمة الإجمالية</th>
                                                <th>الحالة</th>
                                                <th>آخر تحديث</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody id="inventory-table-body">
                                            ${this.renderInventoryRows()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stock Transaction Modal -->
                <div class="modal fade" id="stockTransactionModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="stockTransactionModalTitle">إضافة مخزون</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="stock-transaction-form">
                                    <div class="mb-3">
                                        <label class="form-label">المنتج</label>
                                        <select class="form-select" id="transaction-product" required>
                                            <option value="">اختر المنتج</option>
                                            ${this.inventory.map(product => `
                                                <option value="${product.id}">${product.name}</option>
                                            `).join('')}
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">نوع المعاملة</label>
                                        <select class="form-select" id="transaction-type" required>
                                            <option value="add">إضافة مخزون</option>
                                            <option value="remove">خصم مخزون</option>
                                            <option value="adjust">تعديل مخزون</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">الكمية</label>
                                        <input type="number" class="form-control" id="transaction-quantity" 
                                               min="1" required>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">السبب</label>
                                        <select class="form-select" id="transaction-reason" required>
                                            <option value="">اختر السبب</option>
                                            <option value="purchase">شراء جديد</option>
                                            <option value="return">إرجاع</option>
                                            <option value="expired">انتهاء صلاحية</option>
                                            <option value="damaged">تلف</option>
                                            <option value="theft">فقدان</option>
                                            <option value="adjustment">تعديل جرد</option>
                                            <option value="other">أخرى</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">ملاحظات</label>
                                        <textarea class="form-control" id="transaction-notes" rows="3"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                                <button type="button" class="btn btn-primary" id="save-transaction-btn">تنفيذ المعاملة</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stock Adjustment Modal -->
                <div class="modal fade" id="quickAdjustModal" tabindex="-1">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">تعديل سريع للمخزون</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="text-center mb-3">
                                    <span class="fs-1" id="quick-adjust-product-icon">🍦</span>
                                    <h6 id="quick-adjust-product-name">اسم المنتج</h6>
                                    <p class="text-muted">الكمية الحالية: <span id="quick-adjust-current-stock">0</span></p>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">الكمية الجديدة</label>
                                    <input type="number" class="form-control" id="quick-adjust-new-stock" 
                                           min="0" required>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                                <button type="button" class="btn btn-primary" id="save-quick-adjust-btn">حفظ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderInventoryRows() {
        return this.filteredInventory.map(product => {
            const stockStatus = this.getStockStatus(product);
            const totalValue = product.stock * product.cost;
            
            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <span class="me-2 fs-4">${product.image}</span>
                            <div>
                                <strong>${product.name}</strong><br>
                                <small class="text-muted">${product.flavor}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-info">${product.category}</span>
                    </td>
                    <td>
                        <span class="fs-5 fw-bold">${product.stock}</span>
                    </td>
                    <td>${product.minStock}</td>
                    <td>${Helpers.formatCurrency(product.cost)}</td>
                    <td>${Helpers.formatCurrency(totalValue)}</td>
                    <td>
                        <span class="status-badge ${stockStatus.class}">${stockStatus.text}</span>
                    </td>
                    <td>
                        <small class="text-muted">${Helpers.formatDate(product.updatedAt)}</small>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-primary quick-adjust" 
                                    data-product-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success add-stock" 
                                    data-product-id="${product.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning remove-stock" 
                                    data-product-id="${product.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    static getStockStatus(product) {
        if (product.stock <= 0) {
            return { class: 'status-out-of-stock', text: 'نفد المخزون' };
        } else if (product.stock <= product.minStock) {
            return { class: 'status-low-stock', text: 'مخزون منخفض' };
        } else {
            return { class: 'status-in-stock', text: 'متوفر' };
        }
    }

    static getTotalItems() {
        return this.inventory.reduce((total, product) => total + product.stock, 0);
    }

    static getTotalValue() {
        const totalValue = this.inventory.reduce((total, product) => 
            total + (product.stock * product.cost), 0);
        return Helpers.formatCurrency(totalValue);
    }

    static getLowStockCount() {
        return this.inventory.filter(product => 
            product.stock > 0 && product.stock <= product.minStock).length;
    }

    static getOutOfStockCount() {
        return this.inventory.filter(product => product.stock <= 0).length;
    }

    static getLowStockProducts() {
        return this.inventory.filter(product => 
            product.stock > 0 && product.stock <= product.minStock);
    }

    static init() {
        this.setupEventListeners();
    }

    static setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-inventory');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterInventory(e.target.value);
            });
        }

        // Stock status filter
        const statusFilter = document.getElementById('filter-stock-status');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterByStatus(e.target.value);
            });
        }

        // Add stock button
        const addStockBtn = document.getElementById('add-stock-btn');
        if (addStockBtn) {
            addStockBtn.addEventListener('click', () => {
                this.openStockTransactionModal('add');
            });
        }

        // Adjust stock button
        const adjustStockBtn = document.getElementById('adjust-stock-btn');
        if (adjustStockBtn) {
            adjustStockBtn.addEventListener('click', () => {
                this.openStockTransactionModal('adjust');
            });
        }

        // Export inventory button
        const exportBtn = document.getElementById('export-inventory-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportInventory();
            });
        }

        // Table action buttons
        this.attachTableEventListeners();

        // Save transaction button
        const saveTransactionBtn = document.getElementById('save-transaction-btn');
        if (saveTransactionBtn) {
            saveTransactionBtn.addEventListener('click', () => {
                this.saveStockTransaction();
            });
        }

        // Quick adjust buttons
        const saveQuickAdjustBtn = document.getElementById('save-quick-adjust-btn');
        if (saveQuickAdjustBtn) {
            saveQuickAdjustBtn.addEventListener('click', () => {
                this.saveQuickAdjustment();
            });
        }
    }

    static attachTableEventListeners() {
        // Quick adjust buttons
        document.querySelectorAll('.quick-adjust').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-product-id'));
                this.openQuickAdjustModal(productId);
            });
        });

        // Add stock buttons
        document.querySelectorAll('.add-stock').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-product-id'));
                this.openStockTransactionModal('add', productId);
            });
        });

        // Remove stock buttons
        document.querySelectorAll('.remove-stock').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-product-id'));
                this.openStockTransactionModal('remove', productId);
            });
        });
    }

    static filterInventory(searchTerm) {
        this.filteredInventory = Helpers.searchArray(this.inventory, searchTerm, 
            ['name', 'category', 'flavor']);
        this.updateTable();
    }

    static filterByStatus(status) {
        if (!status) {
            this.filteredInventory = [...this.inventory];
        } else {
            this.filteredInventory = this.inventory.filter(product => {
                const stockStatus = this.getStockStatus(product);
                return stockStatus.class.includes(status);
            });
        }
        this.updateTable();
    }

    static updateTable() {
        const tbody = document.getElementById('inventory-table-body');
        tbody.innerHTML = this.renderInventoryRows();
        this.attachTableEventListeners();
    }

    static openStockTransactionModal(type, productId = null) {
        const modal = new bootstrap.Modal(document.getElementById('stockTransactionModal'));
        const form = document.getElementById('stock-transaction-form');
        
        // Set modal title
        const titles = {
            add: 'إضافة مخزون',
            remove: 'خصم مخزون',
            adjust: 'تعديل مخزون'
        };
        document.getElementById('stockTransactionModalTitle').textContent = titles[type];

        // Reset form
        form.reset();

        // Set transaction type
        document.getElementById('transaction-type').value = type;

        // Set product if specified
        if (productId) {
            document.getElementById('transaction-product').value = productId;
        }

        modal.show();
    }

    static openQuickAdjustModal(productId) {
        const product = app.dataService.getProductById(productId);
        if (!product) return;

        const modal = new bootstrap.Modal(document.getElementById('quickAdjustModal'));
        
        // Set product info
        document.getElementById('quick-adjust-product-icon').textContent = product.image;
        document.getElementById('quick-adjust-product-name').textContent = product.name;
        document.getElementById('quick-adjust-current-stock').textContent = product.stock;
        document.getElementById('quick-adjust-new-stock').value = product.stock;

        // Store product ID for saving
        document.getElementById('save-quick-adjust-btn').setAttribute('data-product-id', productId);

        modal.show();
    }

    static saveStockTransaction() {
        const form = document.getElementById('stock-transaction-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const productId = parseInt(document.getElementById('transaction-product').value);
        const type = document.getElementById('transaction-type').value;
        const quantity = parseInt(document.getElementById('transaction-quantity').value);
        const reason = document.getElementById('transaction-reason').value;
        const notes = document.getElementById('transaction-notes').value;

        const product = app.dataService.getProductById(productId);
        if (!product) {
            app.showToast('خطأ', 'المنتج غير موجود', 'error');
            return;
        }

        let newStock = product.stock;
        
        switch (type) {
            case 'add':
                newStock += quantity;
                break;
            case 'remove':
                newStock -= quantity;
                if (newStock < 0) {
                    app.showToast('خطأ', 'لا يمكن أن يكون المخزون أقل من صفر', 'error');
                    return;
                }
                break;
            case 'adjust':
                newStock = quantity;
                break;
        }

        try {
            app.dataService.updateProduct(productId, { stock: newStock });
            
            // Log the transaction (in a real app, this would be stored in a separate transactions table)
            console.log('Stock transaction:', {
                productId,
                type,
                quantity,
                reason,
                notes,
                oldStock: product.stock,
                newStock,
                timestamp: new Date()
            });

            app.showToast('تم بنجاح', 'تم تحديث المخزون بنجاح', 'success');
            
            // Close modal and refresh
            bootstrap.Modal.getInstance(document.getElementById('stockTransactionModal')).hide();
            this.refreshInventory();

        } catch (error) {
            app.showToast('خطأ', 'فشل في تحديث المخزون', 'error');
        }
    }

    static saveQuickAdjustment() {
        const productId = parseInt(document.getElementById('save-quick-adjust-btn').getAttribute('data-product-id'));
        const newStock = parseInt(document.getElementById('quick-adjust-new-stock').value);

        if (newStock < 0) {
            app.showToast('خطأ', 'لا يمكن أن يكون المخزون أقل من صفر', 'error');
            return;
        }

        try {
            app.dataService.updateProduct(productId, { stock: newStock });
            
            app.showToast('تم بنجاح', 'تم تحديث المخزون بنجاح', 'success');
            
            // Close modal and refresh
            bootstrap.Modal.getInstance(document.getElementById('quickAdjustModal')).hide();
            this.refreshInventory();

        } catch (error) {
            app.showToast('خطأ', 'فشل في تحديث المخزون', 'error');
        }
    }

    static exportInventory() {
        const inventoryData = this.inventory.map(product => ({
            'اسم المنتج': product.name,
            'الفئة': product.category,
            'النكهة': product.flavor,
            'الكمية المتوفرة': product.stock,
            'الحد الأدنى': product.minStock,
            'التكلفة': product.cost,
            'القيمة الإجمالية': product.stock * product.cost,
            'الحالة': this.getStockStatus(product).text,
            'آخر تحديث': Helpers.formatDate(product.updatedAt)
        }));

        const csvContent = this.convertToCSV(inventoryData);
        const filename = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
        
        Helpers.downloadFile(csvContent, filename, 'text/csv');
        app.showToast('تم التصدير', 'تم تصدير تقرير المخزون بنجاح', 'success');
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

    static refreshInventory() {
        this.inventory = app.dataService.getAllProducts();
        this.filteredInventory = [...this.inventory];
        
        // Re-render the entire component
        app.loadComponent('inventory');
    }
}
