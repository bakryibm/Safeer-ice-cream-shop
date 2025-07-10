// Products Management Window Component
class ProductsWindow {
    static products = [];
    static filteredProducts = [];
    static currentProduct = null;

    static async render() {
        this.products = app.dataService.getAllProducts();
        this.filteredProducts = [...this.products];

        return `
            <div class="products-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-ice-cream me-2"></i>
                            إدارة المنتجات
                        </h1>
                        <p class="text-muted">إضافة وتعديل وحذف منتجات الآيس كريم</p>
                    </div>
                </div>

                <!-- Controls -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control" id="search-products" 
                                   placeholder="البحث عن منتج...">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" id="filter-category">
                            <option value="">جميع الفئات</option>
                            <option value="كوب">كوب</option>
                            <option value="كورنيت">كورنيت</option>
                            <option value="عبوة">عبوة</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-primary w-100" id="add-product-btn">
                            <i class="fas fa-plus me-2"></i>
                            إضافة منتج جديد
                        </button>
                    </div>
                </div>

                <!-- Products Table -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>الصورة</th>
                                                <th>اسم المنتج</th>
                                                <th>الفئة</th>
                                                <th>النكهة</th>
                                                <th>السعر</th>
                                                <th>التكلفة</th>
                                                <th>المخزون</th>
                                                <th>الحالة</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody id="products-table-body">
                                            ${this.renderTableRows()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add/Edit Product Modal -->
                <div class="modal fade" id="productModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="productModalTitle">إضافة منتج جديد</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="product-form">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">اسم المنتج</label>
                                                <input type="text" class="form-control" id="product-name" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الاسم بالإنجليزية</label>
                                                <input type="text" class="form-control" id="product-name-en">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الفئة</label>
                                                <select class="form-select" id="product-category" required>
                                                    <option value="">اختر الفئة</option>
                                                    <option value="كوب">كوب</option>
                                                    <option value="كورنيت">كورنيت</option>
                                                    <option value="عبوة">عبوة</option>
                                                    <option value="مشروب">مشروب</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">النكهة</label>
                                                <select class="form-select" id="product-flavor" required>
                                                    <option value="">اختر النكهة</option>
                                                    <option value="فانيليا">فانيليا</option>
                                                    <option value="شوكولاتة">شوكولاتة</option>
                                                    <option value="فراولة">فراولة</option>
                                                    <option value="مانجو">مانجو</option>
                                                    <option value="نعناع">نعناع</option>
                                                    <option value="كوكيز">كوكيز</option>
                                                    <option value="كراميل">كراميل</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">السعر (ر.ع)</label>
                                                <input type="number" class="form-control" id="product-price" 
                                                       step="0.001" min="0" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">التكلفة (ر.ع)</label>
                                                <input type="number" class="form-control" id="product-cost" 
                                                       step="0.001" min="0" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الكمية في المخزون</label>
                                                <input type="number" class="form-control" id="product-stock" 
                                                       min="0" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الحد الأدنى للمخزون</label>
                                                <input type="number" class="form-control" id="product-min-stock" 
                                                       min="0" value="10" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الرمز التعبيري</label>
                                                <select class="form-select" id="product-image">
                                                    <option value="🍦">🍦</option>
                                                    <option value="🍧">🍧</option>
                                                    <option value="🍨">🍨</option>
                                                    <option value="🍫">🍫</option>
                                                    <option value="🍓">🍓</option>
                                                    <option value="🥭">🥭</option>
                                                    <option value="🌿">🌿</option>
                                                    <option value="🍪">🍪</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">الحالة</label>
                                                <select class="form-select" id="product-status">
                                                    <option value="true">متاح</option>
                                                    <option value="false">غير متاح</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">الوصف</label>
                                        <textarea class="form-control" id="product-description" rows="3"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                                <button type="button" class="btn btn-primary" id="save-product-btn">حفظ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderTableRows() {
        return this.filteredProducts.map(product => `
            <tr>
                <td>
                    <span class="fs-3">${product.image}</span>
                </td>
                <td>
                    <strong>${product.name}</strong>
                    ${product.nameEn ? `<br><small class="text-muted">${product.nameEn}</small>` : ''}
                </td>
                <td>
                    <span class="badge bg-info">${product.category}</span>
                </td>
                <td>
                    <span class="ice-cream-flavor ${product.flavor.toLowerCase()}">${product.flavor}</span>
                </td>
                <td>${Helpers.formatCurrency(product.price)}</td>
                <td>${Helpers.formatCurrency(product.cost)}</td>
                <td>
                    <span class="badge ${this.getStockBadgeClass(product)}">${product.stock}</span>
                </td>
                <td>
                    <span class="badge ${product.isActive ? 'bg-success' : 'bg-danger'}">
                        ${product.isActive ? 'متاح' : 'غير متاح'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary edit-product" 
                                data-product-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-product" 
                                data-product-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    static getStockBadgeClass(product) {
        if (product.stock <= 0) return 'bg-danger';
        if (product.stock <= product.minStock) return 'bg-warning';
        return 'bg-success';
    }

    static init() {
        this.setupEventListeners();
    }

    static setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-products');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.openProductModal();
            });
        }

        // Edit product buttons
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-product-id'));
                this.editProduct(productId);
            });
        });

        // Delete product buttons
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-product-id'));
                this.deleteProduct(productId);
            });
        });

        // Save product button
        const saveProductBtn = document.getElementById('save-product-btn');
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', () => {
                this.saveProduct();
            });
        }
    }

    static filterProducts(searchTerm) {
        this.filteredProducts = Helpers.searchArray(this.products, searchTerm, 
            ['name', 'nameEn', 'category', 'flavor', 'description']);
        this.updateTable();
    }

    static filterByCategory(category) {
        this.filteredProducts = category ? 
            this.products.filter(p => p.category === category) : 
            [...this.products];
        this.updateTable();
    }

    static updateTable() {
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = this.renderTableRows();
        
        // Re-attach event listeners
        this.attachTableEventListeners();
    }

    static attachTableEventListeners() {
        // Edit product buttons
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-product-id'));
                this.editProduct(productId);
            });
        });

        // Delete product buttons
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-product-id'));
                this.deleteProduct(productId);
            });
        });
    }

    static openProductModal(product = null) {
        this.currentProduct = product;
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        const form = document.getElementById('product-form');
        
        // Set modal title
        document.getElementById('productModalTitle').textContent = 
            product ? 'تعديل المنتج' : 'إضافة منتج جديد';

        // Reset form
        form.reset();

        // If editing, populate form
        if (product) {
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-name-en').value = product.nameEn || '';
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-flavor').value = product.flavor;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-cost').value = product.cost;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-min-stock').value = product.minStock;
            document.getElementById('product-image').value = product.image;
            document.getElementById('product-status').value = product.isActive.toString();
            document.getElementById('product-description').value = product.description || '';
        }

        modal.show();
    }

    static editProduct(productId) {
        const product = app.dataService.getProductById(productId);
        if (product) {
            this.openProductModal(product);
        }
    }

    static async deleteProduct(productId) {
        const product = app.dataService.getProductById(productId);
        if (!product) return;

        if (confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
            try {
                app.dataService.deleteProduct(productId);
                this.refreshProducts();
                app.showToast('تم الحذف', 'تم حذف المنتج بنجاح', 'success');
            } catch (error) {
                app.showToast('خطأ', 'فشل في حذف المنتج', 'error');
            }
        }
    }

    static saveProduct() {
        const form = document.getElementById('product-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const productData = {
            name: document.getElementById('product-name').value,
            nameEn: document.getElementById('product-name-en').value,
            category: document.getElementById('product-category').value,
            flavor: document.getElementById('product-flavor').value,
            price: parseFloat(document.getElementById('product-price').value),
            cost: parseFloat(document.getElementById('product-cost').value),
            stock: parseInt(document.getElementById('product-stock').value),
            minStock: parseInt(document.getElementById('product-min-stock').value),
            image: document.getElementById('product-image').value,
            isActive: document.getElementById('product-status').value === 'true',
            description: document.getElementById('product-description').value
        };

        try {
            if (this.currentProduct) {
                // Update existing product
                app.dataService.updateProduct(this.currentProduct.id, productData);
                app.showToast('تم التحديث', 'تم تحديث المنتج بنجاح', 'success');
            } else {
                // Add new product
                app.dataService.addProduct(productData);
                app.showToast('تم الإضافة', 'تم إضافة المنتج بنجاح', 'success');
            }

            // Close modal and refresh
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            this.refreshProducts();

        } catch (error) {
            app.showToast('خطأ', 'فشل في حفظ المنتج', 'error');
        }
    }

    static refreshProducts() {
        this.products = app.dataService.getAllProducts();
        this.filteredProducts = [...this.products];
        this.updateTable();
    }
}
