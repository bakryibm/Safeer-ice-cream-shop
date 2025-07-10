// Main Dashboard Component
class MainDashboard {
    static async render() {
        const stats = app.dataService.getDashboardStats();
        const topProducts = app.dataService.getTopSellingProducts(5);
        const chartData = app.dataService.getSalesChartData(7);

        return `
            <div class="dashboard-container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-3">
                            <i class="fas fa-home me-2"></i>
                            لوحة التحكم الرئيسية
                        </h1>
                        <p class="text-muted">مرحباً بك في نظام إدارة محل الآيس كريم</p>
                    </div>
                </div>

                <!-- Stats Cards -->
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
                                        <h3>${Helpers.formatNumber(stats.totalProducts)}</h3>
                                        <p class="mb-0">إجمالي المنتجات</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-ice-cream"></i>
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
                                        <h3>${Helpers.formatNumber(stats.totalCustomers)}</h3>
                                        <p class="mb-0">إجمالي العملاء</p>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fas fa-users"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="fas fa-bolt me-2"></i>
                                    الإجراءات السريعة
                                </h5>
                                <div class="row">
                                    <div class="col-md-3 col-sm-6 mb-3">
                                        <button class="btn btn-primary w-100 quick-action-btn" data-component="sales">
                                            <i class="fas fa-cash-register d-block mb-2" style="font-size: 2rem;"></i>
                                            بدء البيع
                                        </button>
                                    </div>
                                    <div class="col-md-3 col-sm-6 mb-3">
                                        <button class="btn btn-success w-100 quick-action-btn" data-component="products">
                                            <i class="fas fa-plus d-block mb-2" style="font-size: 2rem;"></i>
                                            إضافة منتج
                                        </button>
                                    </div>
                                    <div class="col-md-3 col-sm-6 mb-3">
                                        <button class="btn btn-info w-100 quick-action-btn" data-component="customers">
                                            <i class="fas fa-user-plus d-block mb-2" style="font-size: 2rem;"></i>
                                            إضافة عميل
                                        </button>
                                    </div>
                                    <div class="col-md-3 col-sm-6 mb-3">
                                        <button class="btn btn-warning w-100 quick-action-btn" data-component="reports">
                                            <i class="fas fa-chart-line d-block mb-2" style="font-size: 2rem;"></i>
                                            عرض التقارير
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts and Tables -->
                <div class="row">
                    <div class="col-lg-8 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-line me-2"></i>
                                    مبيعات آخر 7 أيام
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="salesChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-star me-2"></i>
                                    أكثر المنتجات مبيعاً
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="list-group list-group-flush">
                                    ${topProducts.map((product, index) => `
                                        <div class="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <div class="fw-bold">${product.name}</div>
                                                <small class="text-muted">${Helpers.formatNumber(product.totalQuantity)} قطعة</small>
                                            </div>
                                            <span class="badge bg-primary rounded-pill">${index + 1}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Sales -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-receipt me-2"></i>
                                    آخر المبيعات
                                </h5>
                                <button class="btn btn-sm btn-outline-primary" data-component="reports">
                                    عرض الكل
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>رقم المعاملة</th>
                                                <th>التاريخ</th>
                                                <th>المبلغ</th>
                                                <th>طريقة الدفع</th>
                                                <th>الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${app.dataService.getAllSales().slice(0, 5).map(sale => `
                                                <tr>
                                                    <td>${sale.transactionId}</td>
                                                    <td>${Helpers.formatDateTime(sale.date)}</td>
                                                    <td>${Helpers.formatCurrency(sale.total)}</td>
                                                    <td>
                                                        <span class="badge bg-info">${sale.paymentMethod}</span>
                                                    </td>
                                                    <td>
                                                        <span class="badge bg-success">مكتمل</span>
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

                <!-- Low Stock Alert -->
                ${stats.lowStockProducts > 0 ? `
                    <div class="row mt-4">
                        <div class="col-12">
                            <div class="alert alert-warning" role="alert">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <strong>تنبيه!</strong> هناك ${stats.lowStockProducts} منتج لديه مخزون منخفض.
                                <button class="btn btn-warning btn-sm ms-2" data-component="inventory">
                                    عرض المخزون
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static init() {
        // Initialize chart
        this.initializeSalesChart();
        
        // Setup quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const component = e.target.getAttribute('data-component') || 
                                e.target.closest('[data-component]').getAttribute('data-component');
                app.navigateToComponent(component);
            });
        });

        // Setup navigation buttons
        document.querySelectorAll('button[data-component]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const component = e.target.getAttribute('data-component') || 
                                e.target.closest('[data-component]').getAttribute('data-component');
                app.navigateToComponent(component);
            });
        });
    }

    static initializeSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const chartData = app.dataService.getSalesChartData(7);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'المبيعات (ر.ع)',
                    data: chartData.data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'إحصائيات المبيعات اليومية'
                    },
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
