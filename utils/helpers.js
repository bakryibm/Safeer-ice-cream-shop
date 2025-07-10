// Helper utilities for the Ice Cream Shop application
class Helpers {
    // Format currency in Omani Rial
    static formatCurrency(amount) {
        return new Intl.NumberFormat('ar-OM', {
            style: 'currency',
            currency: 'OMR',
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }).format(amount);
    }

    // Format date in Arabic
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('ar-OM', { ...defaultOptions, ...options })
            .format(new Date(date));
    }

    // Format date and time
    static formatDateTime(date) {
        return new Intl.DateTimeFormat('ar-OM', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // Generate random ID
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Validate email
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone number (Omani format)
    static validatePhone(phone) {
        const phoneRegex = /^(968)?[79]\d{7}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Deep clone object
    static deepClone(obj) {
        if (obj === null || typeof obj !== "object") return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === "object") {
            const clonedObj = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    // Format number with Arabic numerals
    static formatNumber(num) {
        return new Intl.NumberFormat('ar-OM').format(num);
    }

    // Convert English digits to Arabic
    static toArabicDigits(str) {
        const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
        return str.toString().replace(/[0-9]/g, function(match) {
            return arabicDigits[match];
        });
    }

    // Convert Arabic digits to English
    static toEnglishDigits(str) {
        const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
        return str.toString().replace(/[٠-٩]/g, function(match) {
            return arabicDigits.indexOf(match);
        });
    }

    // Calculate percentage
    static calculatePercentage(part, total) {
        if (total === 0) return 0;
        return (part / total) * 100;
    }

    // Calculate discount amount
    static calculateDiscount(price, discountPercent) {
        return price * (discountPercent / 100);
    }

    // Calculate tax amount
    static calculateTax(amount, taxRate) {
        return amount * taxRate;
    }

    // Generate receipt number
    static generateReceiptNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `RCP${timestamp.slice(-6)}${random}`;
    }

    // Generate transaction ID
    static generateTransactionId() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TXN${timestamp.slice(-8)}${random}`;
    }

    // Storage utilities
    static setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting localStorage:', error);
            return false;
        }
    }

    static getLocalStorage(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('Error getting localStorage:', error);
            return defaultValue;
        }
    }

    // Print utilities
    static printReceipt(content) {
        const printWindow = window.open('', '', 'width=300,height=400');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body { font-family: Arial, sans-serif; font-size: 12px; direction: rtl; }
                        .receipt { width: 100%; max-width: 300px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .items { margin: 20px 0; }
                        .item { display: flex; justify-content: space-between; margin: 5px 0; }
                        .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
                        .footer { text-align: center; margin-top: 20px; font-size: 10px; }
                    </style>
                </head>
                <body>
                    <div class="receipt">${content}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }

    // Animation utilities
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = performance.now();
        
        function fade(timestamp) {
            let elapsed = timestamp - start;
            let progress = elapsed / duration;
            
            if (progress > 1) progress = 1;
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            }
        }
        
        requestAnimationFrame(fade);
    }

    static fadeOut(element, duration = 300) {
        let start = performance.now();
        
        function fade(timestamp) {
            let elapsed = timestamp - start;
            let progress = elapsed / duration;
            
            if (progress > 1) progress = 1;
            
            element.style.opacity = 1 - progress;
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(fade);
    }

    // File utilities
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    // Form validation utilities
    static validateForm(form, rules) {
        const errors = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = form[field];
            
            if (fieldRules.required && (!value || value.trim() === '')) {
                errors[field] = 'هذا الحقل مطلوب';
                continue;
            }
            
            if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = `يجب أن يكون الحد الأدنى ${fieldRules.minLength} أحرف`;
                continue;
            }
            
            if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = `يجب ألا يزيد عن ${fieldRules.maxLength} أحرف`;
                continue;
            }
            
            if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
                errors[field] = fieldRules.message || 'صيغة غير صحيحة';
                continue;
            }
            
            if (fieldRules.email && !this.validateEmail(value)) {
                errors[field] = 'البريد الإلكتروني غير صحيح';
                continue;
            }
            
            if (fieldRules.phone && !this.validatePhone(value)) {
                errors[field] = 'رقم الهاتف غير صحيح';
                continue;
            }
        }
        
        return errors;
    }

    // Search and filter utilities
    static searchArray(array, searchTerm, fields) {
        if (!searchTerm) return array;
        
        const term = searchTerm.toLowerCase();
        
        return array.filter(item => {
            return fields.some(field => {
                const value = this.getNestedValue(item, field);
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    }

    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    // Sort utilities
    static sortArray(array, field, direction = 'asc') {
        return [...array].sort((a, b) => {
            const aValue = this.getNestedValue(a, field);
            const bValue = this.getNestedValue(b, field);
            
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Color utilities
    static getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Chart utilities
    static generateChartColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(this.getRandomColor());
        }
        return colors;
    }
}

// Make helpers available globally
window.Helpers = Helpers;
