// Fix for component references to app.dataService
// This script will be executed after all components are loaded

// Wait for DOM and all scripts to load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure app is globally available
    if (typeof app !== 'undefined') {
        window.app = app;
    }

    // Override console.error to catch component loading errors
    const originalConsoleError = console.error;
    console.error = function(...args) {
        originalConsoleError.apply(console, args);
        
        // If it's a component loading error, try to reload with fallback
        if (args[0] && args[0].includes && args[0].includes('Component') && args[0].includes('not found')) {
            console.log('Attempting to reload components with fallbacks...');
            initializeComponentFallbacks();
        }
    };

    // Initialize component fallbacks
    function initializeComponentFallbacks() {
        // Ensure all component classes are available globally
        if (typeof MainDashboard !== 'undefined') window.MainDashboard = MainDashboard;
        if (typeof SalesWindow !== 'undefined') window.SalesWindow = SalesWindow;
        if (typeof ProductsWindow !== 'undefined') window.ProductsWindow = ProductsWindow;
        if (typeof InventoryWindow !== 'undefined') window.InventoryWindow = InventoryWindow;
        if (typeof CustomersWindow !== 'undefined') window.CustomersWindow = CustomersWindow;
        if (typeof ReportsWindow !== 'undefined') window.ReportsWindow = ReportsWindow;
        if (typeof UsersWindow !== 'undefined') window.UsersWindow = UsersWindow;
        if (typeof SettingsWindow !== 'undefined') window.SettingsWindow = SettingsWindow;
    }

    // Initialize fallbacks immediately
    initializeComponentFallbacks();
    
    // Also check after a short delay
    setTimeout(initializeComponentFallbacks, 100);
});

// Global error handler for undefined references
window.addEventListener('error', function(event) {
    if (event.error && event.error.message && event.error.message.includes('app is not defined')) {
        console.warn('App reference error detected, ensuring global availability');
        if (typeof app !== 'undefined') {
            window.app = app;
        }
    }
});