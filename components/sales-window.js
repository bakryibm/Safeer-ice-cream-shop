// Sales Window Component - Fixed cart and data type conflicts
class SalesWindow {
    static cart = new Map(); // Using Map to fix cartItems type conflict
    static selectedCustomer = null;
    static paymentMethod = 'نقداً';
    static discount = 0;

    static async render() {
        const products = app.dataService.getAllProducts();
        const customers = app.dataService.getAllCustomers();

        return `
            <div class="sales-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-cash-register me-2"></i>
                            نقطة البيع
                        </h1>
                        <p class="text-muted">اختر المنتجات وأتمم عملية البيع</p>
                    </div>
                </div>

                <div class="row">
                    <!-- Products Section -->
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-ice-cream me-2"></i>
                                    المنتجات المتاحة
                                </h5>
                            </div>
                            <div class="card-body">
                                <!-- Search and Filter -->
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="fas fa-search"></i>
                                            </span>
                                            <input type="text" class="form-control" id="product-search" 
                                                   placeholder="البحث عن منتج...">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <select class="form-select" id="category-filter">
                                            <option value="">جميع الفئات</option>
                                            <option value="كوب">كوب</option>
                                            <option value="كورنيت">كورنيت</option>
                                            <option value="عبوة">عبوة</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Products Grid -->
                                <div class="product-grid" id="products-grid">
                                    ${products.map(product => `
                                        <div class="product-card" data-product-id="${product.id}">
                                            <div class="product-image">
                                                <span class="display-4">${product.image}</span>
                                            </div>
                                            <h6 class="product-name">${product.name}</h6>
                                            <p class="product-price">${Helpers.formatCurrency(product.price)}</p>
                                            <div class="product-info">
                                                <small class="text-muted">النكهة: ${product.flavor}</small><br>
                                                <small class="text-muted">المتوفر: ${product.stock}</small>
                                            </div>
                                            <button class="btn btn-primary btn-sm w-100 mt-2 add-to-cart" 
                                                    data-product-id="${product.id}"
                                                    ${product.stock <= 0 ? 'disabled' : ''}>
                                                <i class="fas fa-plus me-1"></i>
                                                إضافة للسلة
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Section -->
                    <div class="col-lg-4">
                        <div class="card cart-section">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-shopping-cart me-2"></i>
                                    سلة التسوق
                                </h5>
                            </div>
                            <div class="card-body">
                                <!-- Customer Selection -->
                                <div class="mb-3">
                                    <label class="form-label">العميل (اختياري)</label>
                                    <select class="form-select" id="customer-select">
                                        <option value="">عميل جديد</option>
                                        ${customers.map(customer => `
                                            <option value="${customer.id}">${customer.name}</option>
                                        `).join('')}
                                    </select>
                                </div>

                                <!-- Cart Items -->
                                <div class="cart-items" id="cart-items">
                                    <div class="empty-cart text-center py-4">
                                        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                        <p class="text-muted">السلة فارغة</p>
                                    </div>
                                </div>

                                <!-- Cart Summary -->
                                <div class="cart-summary mt-3" id="cart-summary" style="display: none;">
                                    <hr>
                                    
                                    <!-- Discount -->
                                    <div class="mb-3">
                                        <label class="form-label">الخصم (%)</label>
                                        <input type="number" class="form-control" id="discount-input" 
                                               min="0" max="100" value="0">
                                    </div>

                                    <!-- Payment Method -->
                                    <div class="mb-3">
                                        <label class="form-label">طريقة الدفع</label>
                                        <select class="form-select" id="payment-method">
                                            <option value="نقداً">نقداً</option>
                                            <option value="بطاقة">بطاقة</option>
                                            <option value="تحويل">تحويل</option>
                                        </select>
                                    </div>

                                    <!-- Total -->
                                    <div class="total-section">
                                        <div class="d-flex justify-content-between">
                                            <span>المجموع الجزئي:</span>
                                            <span id="subtotal">0.000 ر.ع</span>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <span>الخصم:</span>
                                            <span id="discount-amount">0.000 ر.ع</span>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <span>الضريبة:</span>
                                            <span id="tax-amount">0.000 ر.ع</span>
                                        </div>
                                        <hr>
                                        <div class="d-flex justify-content-between fs-5 fw-bold">
                                            <span>المجموع الكلي:</span>
                                            <span id="total-amount">0.000 ر.ع</span>
                                        </div>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="d-grid gap-2 mt-3">
                                        <button class="btn btn-success" id="complete-sale">
                                            <i class="fas fa-check me-2"></i>
                                            إتمام البيع
                                        </button>
                                        <button class="btn btn-outline-secondary" id="clear-cart">
                                            <i class="fas fa-trash me-2"></i>
                                            إفراغ السلة
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

    static init() {
        // Clear cart on initialization
        this.cart.clear();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update cart display
        this.updateCartDisplay();
    }

    static setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-product-id'));
                this.addToCart(productId);
            });
        });

        // Product search
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        // Customer selection
        const customerSelect = document.getElementById('customer-select');
        if (customerSelect) {
            customerSelect.addEventListener('change', (e) => {
                this.selectedCustomer = e.target.value ? parseInt(e.target.value) : null;
                this.updateCartDisplay();
            });
        }

        // Discount input
        const discountInput = document.getElementById('discount-input');
        if (discountInput) {
            discountInput.addEventListener('input', (e) => {
                this.discount = parseFloat(e.target.value) || 0;
                this.updateCartDisplay();
            });
        }

        // Payment method
        const paymentSelect = document.getElementById('payment-method');
        if (paymentSelect) {
            paymentSelect.addEventListener('change', (e) => {
                this.paymentMethod = e.target.value;
            });
        }

        // Complete sale
        const completeSaleBtn = document.getElementById('complete-sale');
        if (completeSaleBtn) {
            completeSaleBtn.addEventListener('click', () => {
                this.completeSale();
            });
        }

        // Clear cart
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }
    }

    static addToCart(productId) {
        const product = app.dataService.getProductById(productId);
        if (!product || product.stock <= 0) {
            app.showToast('خطأ', 'المنتج غير متوفر', 'error');
            return;
        }

        // Check if already in cart
        if (this.cart.has(productId)) {
            const currentQuantity = this.cart.get(productId).quantity;
            if (currentQuantity >= product.stock) {
                app.showToast('تنبيه', 'لا يمكن إضافة المزيد من هذا المنتج', 'warning');
                return;
            }
            this.cart.get(productId).quantity += 1;
        } else {
            this.cart.set(productId, {
                product: product,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        app.showToast('تم', 'تمت إضافة المنتج للسلة', 'success');
    }

    static removeFromCart(productId) {
        this.cart.delete(productId);
        this.updateCartDisplay();
        app.showToast('تم', 'تم حذف المنتج من السلة', 'success');
    }

    static updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const product = app.dataService.getProductById(productId);
        if (quantity > product.stock) {
            app.showToast('تنبيه', 'الكمية المطلوبة أكبر من المتوفر', 'warning');
            return;
        }

        if (this.cart.has(productId)) {
            this.cart.get(productId).quantity = quantity;
            this.updateCartDisplay();
        }
    }

    static updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        
        if (this.cart.size === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">السلة فارغة</p>
                </div>
            `;
            cartSummary.style.display = 'none';
            return;
        }

        // Display cart items
        let cartItemsHtml = '';
        this.cart.forEach((item, productId) => {
            cartItemsHtml += `
                <div class="cart-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${item.product.name}</h6>
                            <small class="text-muted">${Helpers.formatCurrency(item.product.price)}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="SalesWindow.updateQuantity(${productId}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="SalesWindow.updateQuantity(${productId}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger ms-2" 
                                    onclick="SalesWindow.removeFromCart(${productId})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-end">
                        <small>المجموع: ${Helpers.formatCurrency(item.product.price * item.quantity)}</small>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = cartItemsHtml;
        cartSummary.style.display = 'block';

        // Calculate totals
        this.calculateTotals();
    }

    static calculateTotals() {
        let subtotal = 0;
        this.cart.forEach((item) => {
            subtotal += item.product.price * item.quantity;
        });

        const discountAmount = subtotal * (this.discount / 100);
        const taxAmount = (subtotal - discountAmount) * 0.05; // 5% tax
        const total = subtotal - discountAmount + taxAmount;

        // Update display
        document.getElementById('subtotal').textContent = Helpers.formatCurrency(subtotal);
        document.getElementById('discount-amount').textContent = Helpers.formatCurrency(discountAmount);
        document.getElementById('tax-amount').textContent = Helpers.formatCurrency(taxAmount);
        document.getElementById('total-amount').textContent = Helpers.formatCurrency(total);
    }

    static async completeSale() {
        if (this.cart.size === 0) {
            app.showToast('خطأ', 'السلة فارغة', 'error');
            return;
        }

        // Convert cart to sale items
        const items = [];
        this.cart.forEach((item, productId) => {
            items.push({
                productId: productId,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.product.price * item.quantity
            });
        });

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const discountAmount = subtotal * (this.discount / 100);
        const taxAmount = (subtotal - discountAmount) * 0.05;
        const total = subtotal - discountAmount + taxAmount;

        // Create sale data
        const saleData = {
            items: items,
            subtotal: subtotal,
            discount: discountAmount,
            tax: taxAmount,
            total: total,
            paymentMethod: this.paymentMethod,
            customerId: this.selectedCustomer,
            userId: 1 // Current user ID
        };

        try {
            const sale = app.dataService.createSale(saleData);
            
            // Show success message
            app.showToast('تم إتمام البيع بنجاح', `رقم المعاملة: ${sale.transactionId}`, 'success');
            
            // Print receipt
            this.printReceipt(sale);
            
            // Clear cart
            this.clearCart();
            
        } catch (error) {
            app.showToast('خطأ', 'فشل في إتمام البيع', 'error');
            console.error('Sale completion error:', error);
        }
    }

    static printReceipt(sale) {
        const settings = app.dataService.getSettings();
        let receiptHtml = `
            <div class="receipt-header">
                <h3>${settings.receiptHeader}</h3>
                <p>رقم المعاملة: ${sale.transactionId}</p>
                <p>التاريخ: ${Helpers.formatDateTime(sale.date)}</p>
                <hr>
            </div>
            
            <div class="receipt-items">
                ${sale.items.map(item => `
                    <div class="receipt-item">
                        <div>${item.name}</div>
                        <div>${item.quantity} × ${Helpers.formatCurrency(item.price)} = ${Helpers.formatCurrency(item.subtotal)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="receipt-summary">
                <hr>
                <div class="receipt-total">
                    <div>المجموع الجزئي: ${Helpers.formatCurrency(sale.subtotal)}</div>
                    <div>الخصم: ${Helpers.formatCurrency(sale.discount)}</div>
                    <div>الضريبة: ${Helpers.formatCurrency(sale.tax)}</div>
                    <div><strong>الإجمالي: ${Helpers.formatCurrency(sale.total)}</strong></div>
                </div>
                <div class="receipt-payment">
                    <p>طريقة الدفع: ${sale.paymentMethod}</p>
                </div>
            </div>
            
            <div class="receipt-footer">
                <hr>
                <p>${settings.receiptFooter}</p>
            </div>
        `;

        Helpers.printReceipt(receiptHtml);
    }

    static clearCart() {
        this.cart.clear();
        this.selectedCustomer = null;
        this.discount = 0;
        this.paymentMethod = 'نقداً';
        
        // Reset form values
        document.getElementById('customer-select').value = '';
        document.getElementById('discount-input').value = '0';
        document.getElementById('payment-method').value = 'نقداً';
        
        this.updateCartDisplay();
    }

    static filterProducts(searchTerm) {
        const products = app.dataService.getAllProducts();
        const filteredProducts = Helpers.searchArray(products, searchTerm, ['name', 'flavor', 'category']);
        this.updateProductsGrid(filteredProducts);
    }

    static filterByCategory(category) {
        const products = app.dataService.getAllProducts();
        const filteredProducts = category ? products.filter(p => p.category === category) : products;
        this.updateProductsGrid(filteredProducts);
    }

    static updateProductsGrid(products) {
        const grid = document.getElementById('products-grid');
        grid.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <span class="display-4">${product.image}</span>
                </div>
                <h6 class="product-name">${product.name}</h6>
                <p class="product-price">${Helpers.formatCurrency(product.price)}</p>
                <div class="product-info">
                    <small class="text-muted">النكهة: ${product.flavor}</small><br>
                    <small class="text-muted">المتوفر: ${product.stock}</small>
                </div>
                <button class="btn btn-primary btn-sm w-100 mt-2 add-to-cart" 
                        data-product-id="${product.id}"
                        ${product.stock <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-plus me-1"></i>
                    إضافة للسلة
                </button>
            </div>
        `).join('');

        // Re-attach event listeners
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-product-id'));
                this.addToCart(productId);
            });
        });
    }
}
