// Reports and Analytics Window Component
class ReportsWindow {
    static currentReport = 'sales';
    static reportData = null;
    static chartInstances = {};

    static async render() {
        const stats = app.dataService.getDashboardStats();
        const topProducts = app.dataService.getTopSellingProducts(10);

        return `
            <div class="reports-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-chart-bar me-2"></i>
                            التقارير والإحصائيات
                        </h1>
                        <p class="text-muted">تقارير مفصلة عن المبيعات والمخزون والأداء</p>
                    </div>
                </div>

                <!-- Report Navigation -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="btn-group" role="group">
                                            <button class="btn btn-outline-primary active report-tab" 
                                                    data-report="sales">
                                                <i class="fas fa-chart-line me-1"></i>
                                                تقارير المبيعات
                                            </button>
                                            <button class="btn btn-outline-primary report-tab" 
                                                    data-report="inventory">
                                                <i class="fas fa-boxes me-1"></i>
                                                تقارير المخزون
                                            </button>
                                            <button class="btn btn-outline-primary report-tab" 
                                                    data-report="financial">
                                                <i class="fas fa-dollar-sign me-1"></i>
                                                التقارير المالية
                                            </button>
                                            <button class="btn btn-outline-primary report-tab" 
                                                    data-report="customers">
                                                <i class="fas fa-users me-1"></i>
                                                تقارير العملاء
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="d-flex gap-2">
                                            <button class="btn btn-success" id="export-report-btn">
                                                <i class="fas fa-download me-1"></i>
                                                تصدير
                                            </button>
                                            <button class="btn btn-info" id="print-report-btn">
                                                <i class="fas fa-print me-1"></i>
                                                طباعة
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Report Content -->
                <div id="report-content">
                    ${this.renderSalesReport(stats, topProducts)}
                </div>
            </div>
        `;
    }

    static renderSalesReport(stats, topProducts) {
        const chartData = app.dataService.getSalesChartData(30);
        
        return `
            <div class="sales-report">
                <!-- Sales Summary -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(stats.todaySales)}</h3>
                                        <p class="mb-0">مبيعات اليوم</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-cash-register"></i>
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
                                        <h3>${Helpers.formatCurrency(stats.todayRevenue)}</h3>
                                        <p class="mb-0">إيرادات اليوم</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-coins"></i>
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
                                        <h3>${Helpers.formatNumber(stats.monthSales)}</h3>
                                        <p class="mb-0">مبيعات الشهر</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-calendar-alt"></i>
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
                                        <h3>${Helpers.formatCurrency(stats.monthRevenue)}</h3>
                                        <p class="mb-0">إيرادات الشهر</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts -->
                <div class="row mb-4">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-line me-2"></i>
                                    اتجاه المبيعات (آخر 30 يوم)
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="salesTrendChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-pie me-2"></i>
                                    توزيع المبيعات حسب الفئة
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="categoryPieChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Products -->
                <div class="row mb-4">
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-star me-2"></i>
                                    أكثر المنتجات مبيعاً
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>المنتج</th>
                                                <th>الكمية</th>
                                                <th>الإيرادات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${topProducts.map((product, index) => `
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <span class="badge bg-primary rounded-pill me-2">${index + 1}</span>
                                                            ${product.name}
                                                        </div>
                                                    </td>
                                                    <td>${Helpers.formatNumber(product.totalQuantity)}</td>
                                                    <td>${Helpers.formatCurrency(product.totalRevenue)}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-bar me-2"></i>
                                    أداء المبيعات حسب طريقة الدفع
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="paymentMethodChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Date Range Filter -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-filter me-2"></i>
                                    تصفية التقارير حسب التاريخ
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label class="form-label">من تاريخ</label>
                                        <input type="date" class="form-control" id="date-from">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">إلى تاريخ</label>
                                        <input type="date" class="form-control" id="date-to">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">فترة سريعة</label>
                                        <select class="form-select" id="quick-period">
                                            <option value="">اختر الفترة</option>
                                            <option value="today">اليوم</option>
                                            <option value="yesterday">أمس</option>
                                            <option value="this-week">هذا الأسبوع</option>
                                            <option value="last-week">الأسبوع الماضي</option>
                                            <option value="this-month">هذا الشهر</option>
                                            <option value="last-month">الشهر الماضي</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">&nbsp;</label>
                                        <button class="btn btn-primary w-100" id="apply-date-filter">
                                            تطبيق التصفية
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

    static renderInventoryReport() {
        const products = app.dataService.getAllProducts();
        const lowStockProducts = products.filter(p => p.stock <= p.minStock);
        const outOfStockProducts = products.filter(p => p.stock <= 0);
        const totalValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);

        return `
            <div class="inventory-report">
                <!-- Inventory Summary -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(products.length)}</h3>
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
                                        <h3>${Helpers.formatCurrency(totalValue)}</h3>
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
                                        <h3>${Helpers.formatNumber(lowStockProducts.length)}</h3>
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
                                        <h3>${Helpers.formatNumber(outOfStockProducts.length)}</h3>
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

                <!-- Inventory Charts -->
                <div class="row mb-4">
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-bar me-2"></i>
                                    توزيع المخزون حسب الفئة
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="inventoryByCategoryChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-pie me-2"></i>
                                    حالة المخزون
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="stockStatusChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inventory Details -->
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
                                                <th>الكمية</th>
                                                <th>الحد الأدنى</th>
                                                <th>التكلفة</th>
                                                <th>القيمة</th>
                                                <th>الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${products.map(product => `
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <span class="me-2">${product.image}</span>
                                                            ${product.name}
                                                        </div>
                                                    </td>
                                                    <td><span class="badge bg-info">${product.category}</span></td>
                                                    <td>${product.stock}</td>
                                                    <td>${product.minStock}</td>
                                                    <td>${Helpers.formatCurrency(product.cost)}</td>
                                                    <td>${Helpers.formatCurrency(product.stock * product.cost)}</td>
                                                    <td>
                                                        <span class="badge ${this.getInventoryStatusBadge(product)}">
                                                            ${this.getInventoryStatusText(product)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static getInventoryStatusBadge(product) {
        if (product.stock <= 0) return 'bg-danger';
        if (product.stock <= product.minStock) return 'bg-warning';
        return 'bg-success';
    }

    static getInventoryStatusText(product) {
        if (product.stock <= 0) return 'نفد المخزون';
        if (product.stock <= product.minStock) return 'مخزون منخفض';
        return 'متوفر';
    }

    static renderFinancialReport() {
        const sales = app.dataService.getAllSales();
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalCost = sales.reduce((sum, sale) => {
            return sum + sale.items.reduce((itemSum, item) => {
                const product = app.dataService.getProductById(item.productId);
                return itemSum + (product ? product.cost * item.quantity : 0);
            }, 0);
        }, 0);
        const totalProfit = totalRevenue - totalCost;

        return `
            <div class="financial-report">
                <!-- Financial Summary -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatCurrency(totalRevenue)}</h3>
                                        <p class="mb-0">إجمالي الإيرادات</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-chart-line"></i>
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
                                        <h3>${Helpers.formatCurrency(totalCost)}</h3>
                                        <p class="mb-0">إجمالي التكاليف</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-chart-line"></i>
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
                                        <h3>${Helpers.formatCurrency(totalProfit)}</h3>
                                        <p class="mb-0">صافي الربح</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-coins"></i>
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
                                        <h3>${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%</h3>
                                        <p class="mb-0">هامش الربح</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-percentage"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Financial Charts -->
                <div class="row mb-4">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-area me-2"></i>
                                    الإيرادات والأرباح الشهرية
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="revenueChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-pie me-2"></i>
                                    توزيع الإيرادات
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="revenueBreakdownChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderCustomersReport() {
        const customers = app.dataService.getAllCustomers();
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.visits > 0).length;
        const totalPurchases = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
        const averagePurchase = totalCustomers > 0 ? totalPurchases / totalCustomers : 0;

        return `
            <div class="customers-report">
                <!-- Customer Summary -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h3>${Helpers.formatNumber(totalCustomers)}</h3>
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
                                        <h3>${Helpers.formatNumber(activeCustomers)}</h3>
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
                                        <h3>${Helpers.formatCurrency(totalPurchases)}</h3>
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
                                        <h3>${Helpers.formatCurrency(averagePurchase)}</h3>
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

                <!-- Customer Details -->
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
                                                <th>نوع العضوية</th>
                                                <th>عدد الزيارات</th>
                                                <th>إجمالي المشتريات</th>
                                                <th>آخر زيارة</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${customers.map(customer => `
                                                <tr>
                                                    <td>${customer.name}</td>
                                                    <td>${customer.phone}</td>
                                                    <td>
                                                        <span class="badge bg-info">${customer.membershipType}</span>
                                                    </td>
                                                    <td>${customer.visits}</td>
                                                    <td>${Helpers.formatCurrency(customer.totalPurchases)}</td>
                                                    <td>${customer.lastVisit ? Helpers.formatDate(customer.lastVisit) : 'لم يزر بعد'}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static init() {
        this.setupEventListeners();
        this.initializeCharts();
    }

    static setupEventListeners() {
        // Report tab navigation
        document.querySelectorAll('.report-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const reportType = e.target.getAttribute('data-report');
                this.switchReport(reportType);
            });
        });

        // Export report
        const exportBtn = document.getElementById('export-report-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        // Print report
        const printBtn = document.getElementById('print-report-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printReport();
            });
        }

        // Date filter
        const applyFilterBtn = document.getElementById('apply-date-filter');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', () => {
                this.applyDateFilter();
            });
        }

        // Quick period selector
        const quickPeriodSelect = document.getElementById('quick-period');
        if (quickPeriodSelect) {
            quickPeriodSelect.addEventListener('change', (e) => {
                this.setQuickPeriod(e.target.value);
            });
        }
    }

    static switchReport(reportType) {
        // Update active tab
        document.querySelectorAll('.report-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-report="${reportType}"]`).classList.add('active');

        // Clear existing charts
        this.clearCharts();

        // Load report content
        this.currentReport = reportType;
        const reportContent = document.getElementById('report-content');

        switch (reportType) {
            case 'sales':
                const stats = app.dataService.getDashboardStats();
                const topProducts = app.dataService.getTopSellingProducts(10);
                reportContent.innerHTML = this.renderSalesReport(stats, topProducts);
                break;
            case 'inventory':
                reportContent.innerHTML = this.renderInventoryReport();
                break;
            case 'financial':
                reportContent.innerHTML = this.renderFinancialReport();
                break;
            case 'customers':
                reportContent.innerHTML = this.renderCustomersReport();
                break;
        }

        // Initialize charts for the new report
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    static initializeCharts() {
        this.clearCharts();

        switch (this.currentReport) {
            case 'sales':
                this.initializeSalesCharts();
                break;
            case 'inventory':
                this.initializeInventoryCharts();
                break;
            case 'financial':
                this.initializeFinancialCharts();
                break;
        }
    }

    static initializeSalesCharts() {
        // Sales trend chart
        const salesTrendCtx = document.getElementById('salesTrendChart');
        if (salesTrendCtx) {
            const chartData = app.dataService.getSalesChartData(30);
            this.chartInstances.salesTrend = new Chart(salesTrendCtx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'المبيعات اليومية',
                        data: chartData.data,
                        borderColor: '#4bc0c0',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return Helpers.formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        // Category pie chart
        const categoryPieCtx = document.getElementById('categoryPieChart');
        if (categoryPieCtx) {
            const products = app.dataService.getAllProducts();
            const categories = {};
            
            products.forEach(product => {
                categories[product.category] = (categories[product.category] || 0) + 1;
            });

            this.chartInstances.categoryPie = new Chart(categoryPieCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: Helpers.generateChartColors(Object.keys(categories).length)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Payment method chart
        const paymentMethodCtx = document.getElementById('paymentMethodChart');
        if (paymentMethodCtx) {
            const sales = app.dataService.getAllSales();
            const paymentMethods = {};
            
            sales.forEach(sale => {
                paymentMethods[sale.paymentMethod] = (paymentMethods[sale.paymentMethod] || 0) + sale.total;
            });

            this.chartInstances.paymentMethod = new Chart(paymentMethodCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(paymentMethods),
                    datasets: [{
                        label: 'قيمة المبيعات',
                        data: Object.values(paymentMethods),
                        backgroundColor: Helpers.generateChartColors(Object.keys(paymentMethods).length)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return Helpers.formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    static initializeInventoryCharts() {
        // Inventory by category chart
        const inventoryByCategoryCtx = document.getElementById('inventoryByCategoryChart');
        if (inventoryByCategoryCtx) {
            const products = app.dataService.getAllProducts();
            const categories = {};
            
            products.forEach(product => {
                categories[product.category] = (categories[product.category] || 0) + product.stock;
            });

            this.chartInstances.inventoryByCategory = new Chart(inventoryByCategoryCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(categories),
                    datasets: [{
                        label: 'عدد القطع',
                        data: Object.values(categories),
                        backgroundColor: Helpers.generateChartColors(Object.keys(categories).length)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Stock status chart
        const stockStatusCtx = document.getElementById('stockStatusChart');
        if (stockStatusCtx) {
            const products = app.dataService.getAllProducts();
            const inStock = products.filter(p => p.stock > p.minStock).length;
            const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
            const outOfStock = products.filter(p => p.stock <= 0).length;

            this.chartInstances.stockStatus = new Chart(stockStatusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['متوفر', 'مخزون منخفض', 'نفد المخزون'],
                    datasets: [{
                        data: [inStock, lowStock, outOfStock],
                        backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    static initializeFinancialCharts() {
        // Revenue chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            const chartData = app.dataService.getSalesChartData(30);
            
            this.chartInstances.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'الإيرادات',
                        data: chartData.data,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return Helpers.formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        // Revenue breakdown chart
        const revenueBreakdownCtx = document.getElementById('revenueBreakdownChart');
        if (revenueBreakdownCtx) {
            const topProducts = app.dataService.getTopSellingProducts(5);
            
            this.chartInstances.revenueBreakdown = new Chart(revenueBreakdownCtx, {
                type: 'pie',
                data: {
                    labels: topProducts.map(p => p.name),
                    datasets: [{
                        data: topProducts.map(p => p.totalRevenue),
                        backgroundColor: Helpers.generateChartColors(topProducts.length)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    static clearCharts() {
        Object.values(this.chartInstances).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.chartInstances = {};
    }

    static exportReport() {
        const reportData = this.generateReportData();
        const filename = `${this.currentReport}_report_${new Date().toISOString().split('T')[0]}.json`;
        
        Helpers.downloadFile(JSON.stringify(reportData, null, 2), filename, 'application/json');
        app.showToast('تم التصدير', 'تم تصدير التقرير بنجاح', 'success');
    }

    static printReport() {
        const printContent = document.getElementById('report-content').innerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>تقرير ${this.currentReport}</title>
                    <style>
                        body { font-family: Arial, sans-serif; direction: rtl; }
                        .card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
                        .stats-card { background: #f8f9fa; }
                        .table { width: 100%; border-collapse: collapse; }
                        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        .badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                        .bg-info { background-color: #17a2b8; color: white; }
                        .bg-success { background-color: #28a745; color: white; }
                        .bg-warning { background-color: #ffc107; color: black; }
                        .bg-danger { background-color: #dc3545; color: white; }
                        @media print { .no-print { display: none !important; } }
                    </style>
                </head>
                <body>
                    <h1>تقرير ${this.currentReport}</h1>
                    <p>تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-OM')}</p>
                    <hr>
                    ${printContent}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }

    static generateReportData() {
        switch (this.currentReport) {
            case 'sales':
                return {
                    type: 'sales',
                    stats: app.dataService.getDashboardStats(),
                    topProducts: app.dataService.getTopSellingProducts(10),
                    salesData: app.dataService.getSalesChartData(30)
                };
            case 'inventory':
                return {
                    type: 'inventory',
                    products: app.dataService.getAllProducts(),
                    summary: {
                        totalProducts: app.dataService.getAllProducts().length,
                        lowStock: app.dataService.getAllProducts().filter(p => p.stock <= p.minStock).length,
                        outOfStock: app.dataService.getAllProducts().filter(p => p.stock <= 0).length
                    }
                };
            case 'financial':
                return {
                    type: 'financial',
                    sales: app.dataService.getAllSales(),
                    summary: this.calculateFinancialSummary()
                };
            case 'customers':
                return {
                    type: 'customers',
                    customers: app.dataService.getAllCustomers(),
                    summary: this.calculateCustomerSummary()
                };
            default:
                return {};
        }
    }

    static calculateFinancialSummary() {
        const sales = app.dataService.getAllSales();
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalCost = sales.reduce((sum, sale) => {
            return sum + sale.items.reduce((itemSum, item) => {
                const product = app.dataService.getProductById(item.productId);
                return itemSum + (product ? product.cost * item.quantity : 0);
            }, 0);
        }, 0);
        
        return {
            totalRevenue,
            totalCost,
            totalProfit: totalRevenue - totalCost,
            profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0
        };
    }

    static calculateCustomerSummary() {
        const customers = app.dataService.getAllCustomers();
        const totalPurchases = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
        
        return {
            totalCustomers: customers.length,
            activeCustomers: customers.filter(c => c.visits > 0).length,
            totalPurchases,
            averagePurchase: customers.length > 0 ? totalPurchases / customers.length : 0
        };
    }

    static applyDateFilter() {
        const fromDate = document.getElementById('date-from').value;
        const toDate = document.getElementById('date-to').value;
        
        if (fromDate && toDate) {
            // In a real application, this would filter the data based on the date range
            app.showToast('تم تطبيق المرشح', `تم تطبيق المرشح من ${fromDate} إلى ${toDate}`, 'success');
        } else {
            app.showToast('خطأ', 'يرجى اختيار تاريخ البداية والنهاية', 'error');
        }
    }

    static setQuickPeriod(period) {
        const today = new Date();
        let fromDate, toDate;
        
        switch (period) {
            case 'today':
                fromDate = toDate = today.toISOString().split('T')[0];
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromDate = toDate = yesterday.toISOString().split('T')[0];
                break;
            case 'this-week':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                fromDate = startOfWeek.toISOString().split('T')[0];
                toDate = today.toISOString().split('T')[0];
                break;
            case 'this-month':
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                toDate = today.toISOString().split('T')[0];
                break;
            default:
                return;
        }
        
        document.getElementById('date-from').value = fromDate;
        document.getElementById('date-to').value = toDate;
    }
}
