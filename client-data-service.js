// Client-side data service with GitHub storage support
class ClientDataService {
    constructor() {
        this.localStorageKey = 'icecream_shop_data';
        this.useGitHubStorage = false;
        this.githubStorage = null;
        this.data = null;
        this.initializeStorage();
    }

    async initializeStorage() {
        // Check if GitHub storage is available
        if (window.githubStorage) {
            this.useGitHubStorage = true;
            this.githubStorage = window.githubStorage;
        }
        
        // Load initial data
        await this.loadData();
    }

    async loadData() {
        try {
            if (this.useGitHubStorage && this.githubStorage) {
                // Load from GitHub
                this.data = await this.githubStorage.readData();
            } else {
                // Load from localStorage
                const storedData = localStorage.getItem(this.localStorageKey);
                if (storedData) {
                    this.data = JSON.parse(storedData);
                } else {
                    this.data = this.getDefaultData();
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.getDefaultData();
        }
    }

    async saveData() {
        try {
            if (this.useGitHubStorage && this.githubStorage) {
                // Save to GitHub
                await this.githubStorage.writeData(this.data);
                // Also save to localStorage as backup
                localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
            } else {
                // Save to localStorage
                localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
            }
        } catch (error) {
            console.error('Error saving data:', error);
            // Fallback to localStorage
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
        }
    }

    getDefaultData() {
        return {
            products: [
                {
                    id: 1,
                    name: 'آيس كريم الفانيليا',
                    category: 'آيس كريم',
                    price: 2.5,
                    cost: 1.2,
                    stock: 50,
                    minStock: 10,
                    description: 'آيس كريم فانيليا طبيعي',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'آيس كريم الشوكولاتة',
                    category: 'آيس كريم',
                    price: 3.0,
                    cost: 1.5,
                    stock: 40,
                    minStock: 10,
                    description: 'آيس كريم شوكولاتة بلجيكي',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'آيس كريم الفراولة',
                    category: 'آيس كريم',
                    price: 2.8,
                    cost: 1.3,
                    stock: 35,
                    minStock: 10,
                    description: 'آيس كريم فراولة طبيعية',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'آيس كريم المانجو',
                    category: 'آيس كريم',
                    price: 3.2,
                    cost: 1.6,
                    stock: 30,
                    minStock: 10,
                    description: 'آيس كريم مانجو استوائي',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'آيس كريم الفستق',
                    category: 'آيس كريم',
                    price: 3.5,
                    cost: 1.8,
                    stock: 25,
                    minStock: 10,
                    description: 'آيس كريم فستق حلبي',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ],
            sales: [],
            customers: [
                {
                    id: 1,
                    name: 'أحمد محمد',
                    phone: '96899123456',
                    email: 'ahmed@example.com',
                    address: 'مسقط، سلطنة عمان',
                    membershipType: 'ذهبي',
                    discount: 10,
                    totalPurchases: 0,
                    visits: 0,
                    createdAt: new Date().toISOString()
                }
            ],
            users: [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    name: 'المدير',
                    role: 'admin',
                    permissions: ['all'],
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                }
            ],
            settings: {
                shopName: 'محل الآيس كريم الذهبي',
                shopNameEn: 'Golden Ice Cream Shop',
                currency: 'OMR',
                currencySymbol: 'ر.ع',
                taxRate: 0.05,
                receiptHeader: 'محل الآيس كريم الذهبي',
                receiptFooter: 'شكراً لزيارتكم',
                lowStockAlert: true,
                autoBackup: true,
                language: 'ar'
            },
            lastUpdated: new Date().toISOString()
        };
    }

    // Product methods
    async getAllProducts() {
        if (!this.data) await this.loadData();
        return this.data.products.filter(p => p.isActive);
    }

    async getProductById(id) {
        if (!this.data) await this.loadData();
        return this.data.products.find(p => p.id === id);
    }

    async addProduct(productData) {
        if (!this.data) await this.loadData();
        const newProduct = {
            id: Math.max(...this.data.products.map(p => p.id), 0) + 1,
            ...productData,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.products.push(newProduct);
        await this.saveData();
        return newProduct;
    }

    async updateProduct(id, productData) {
        if (!this.data) await this.loadData();
        const index = this.data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.products[index] = {
                ...this.data.products[index],
                ...productData,
                updatedAt: new Date().toISOString()
            };
            await this.saveData();
            return this.data.products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        if (!this.data) await this.loadData();
        const index = this.data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.products[index].isActive = false;
            this.data.products[index].updatedAt = new Date().toISOString();
            await this.saveData();
            return true;
        }
        return false;
    }

    // Sales methods
    async getAllSales() {
        if (!this.data) await this.loadData();
        return this.data.sales;
    }

    async createSale(saleData) {
        if (!this.data) await this.loadData();
        const newSale = {
            id: Math.max(...this.data.sales.map(s => s.id), 0) + 1,
            transactionId: `TXN${String(this.data.sales.length + 1).padStart(6, '0')}`,
            date: new Date().toISOString(),
            ...saleData,
            status: 'completed',
            createdAt: new Date().toISOString()
        };
        
        // Update inventory
        if (saleData.items) {
            saleData.items.forEach(item => {
                const product = this.data.products.find(p => p.id === item.productId);
                if (product) {
                    product.stock -= item.quantity;
                    product.updatedAt = new Date().toISOString();
                }
            });
        }
        
        this.data.sales.push(newSale);
        await this.saveData();
        return newSale;
    }

    // Customer methods
    async getAllCustomers() {
        if (!this.data) await this.loadData();
        return this.data.customers;
    }

    async addCustomer(customerData) {
        if (!this.data) await this.loadData();
        const newCustomer = {
            id: Math.max(...this.data.customers.map(c => c.id), 0) + 1,
            ...customerData,
            totalPurchases: 0,
            visits: 0,
            createdAt: new Date().toISOString()
        };
        this.data.customers.push(newCustomer);
        await this.saveData();
        return newCustomer;
    }

    async updateCustomer(id, customerData) {
        if (!this.data) await this.loadData();
        const index = this.data.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.customers[index] = {
                ...this.data.customers[index],
                ...customerData,
                updatedAt: new Date().toISOString()
            };
            await this.saveData();
            return this.data.customers[index];
        }
        return null;
    }

    // User methods
    async getAllUsers() {
        if (!this.data) await this.loadData();
        return this.data.users.map(({ password, ...user }) => user);
    }

    async addUser(userData) {
        if (!this.data) await this.loadData();
        const newUser = {
            id: Math.max(...this.data.users.map(u => u.id), 0) + 1,
            ...userData,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        this.data.users.push(newUser);
        await this.saveData();
        return newUser;
    }

    async updateUser(id, userData) {
        if (!this.data) await this.loadData();
        const index = this.data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.data.users[index] = {
                ...this.data.users[index],
                ...userData,
                updatedAt: new Date().toISOString()
            };
            await this.saveData();
            return this.data.users[index];
        }
        return null;
    }

    // Settings methods
    async getSettings() {
        if (!this.data) await this.loadData();
        return this.data.settings;
    }

    async updateSettings(settingsData) {
        if (!this.data) await this.loadData();
        this.data.settings = { ...this.data.settings, ...settingsData };
        await this.saveData();
        return this.data.settings;
    }

    // Analytics methods
    async getDashboardStats() {
        if (!this.data) await this.loadData();
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const todaySales = this.data.sales.filter(sale => new Date(sale.date) >= startOfDay);
        const monthSales = this.data.sales.filter(sale => new Date(sale.date) >= startOfMonth);
        
        return {
            todaySales: todaySales.length,
            todayRevenue: todaySales.reduce((sum, sale) => sum + sale.total, 0),
            monthSales: monthSales.length,
            monthRevenue: monthSales.reduce((sum, sale) => sum + sale.total, 0),
            totalProducts: this.data.products.filter(p => p.isActive).length,
            totalCustomers: this.data.customers.length,
            lowStockProducts: this.data.products.filter(p => p.stock <= p.minStock).length,
            totalRevenue: this.data.sales.reduce((sum, sale) => sum + sale.total, 0)
        };
    }

    async getTopSellingProducts(limit = 5) {
        if (!this.data) await this.loadData();
        const productSales = {};
        
        this.data.sales.forEach(sale => {
            if (sale.items) {
                sale.items.forEach(item => {
                    productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
                });
            }
        });
        
        return Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([productId, quantity]) => {
                const product = this.data.products.find(p => p.id === parseInt(productId));
                return {
                    ...product,
                    totalSold: quantity
                };
            });
    }

    async exportData() {
        if (!this.data) await this.loadData();
        return {
            ...this.data,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    async importData(importData) {
        this.data = importData;
        await this.saveData();
        return true;
    }
}

// Initialize the data service
const clientDataService = new ClientDataService();

// Export for global use
window.clientDataService = clientDataService;