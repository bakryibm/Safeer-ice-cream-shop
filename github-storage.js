// GitHub Storage API for client-side database
class GitHubStorage {
    constructor(username, repo, token) {
        this.username = username;
        this.repo = repo;
        this.token = token;
        this.baseURL = `https://api.github.com/repos/${username}/${repo}/contents`;
        this.dataFile = 'data/icecreamshop_data.json';
    }

    async readData() {
        try {
            const response = await fetch(`${this.baseURL}/${this.dataFile}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    // File doesn't exist, return default data
                    return this.getDefaultData();
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const content = atob(data.content);
            return JSON.parse(content);
        } catch (error) {
            console.error('Error reading data from GitHub:', error);
            return this.getDefaultData();
        }
    }

    async writeData(data) {
        try {
            const content = btoa(JSON.stringify(data, null, 2));
            
            // First, try to get the current file to get its SHA
            let sha;
            try {
                const response = await fetch(`${this.baseURL}/${this.dataFile}`, {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (response.ok) {
                    const fileData = await response.json();
                    sha = fileData.sha;
                }
            } catch (error) {
                // File doesn't exist, will create new
            }
            
            // Update or create the file
            const updateData = {
                message: `Update ice cream shop data - ${new Date().toISOString()}`,
                content: content,
                ...(sha && { sha: sha })
            };
            
            const response = await fetch(`${this.baseURL}/${this.dataFile}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error writing data to GitHub:', error);
            throw error;
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
}

// Initialize GitHub storage
let githubStorage = null;

// Initialize storage
function initializeGitHubStorage() {
    if (window.GITHUB_CONFIG && window.GITHUB_CONFIG.enabled && window.GITHUB_CONFIG.token && window.GITHUB_CONFIG.token !== '') {
        githubStorage = new GitHubStorage(
            window.GITHUB_CONFIG.username,
            window.GITHUB_CONFIG.repo,
            window.GITHUB_CONFIG.token
        );
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeGitHubStorage();
});

// Export for use in other modules
window.GitHubStorage = GitHubStorage;
window.githubStorage = githubStorage;