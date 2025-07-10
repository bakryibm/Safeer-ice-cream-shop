// Configuration for GitHub Storage
const GITHUB_CONFIG = {
    username: '', // Your GitHub username
    repo: '', // Your repository name
    token: '', // Your GitHub Personal Access Token
    enabled: false // Set to true to enable GitHub storage
};

// Load configuration from localStorage if available
const savedConfig = localStorage.getItem('github_config');
if (savedConfig) {
    try {
        const parsedConfig = JSON.parse(savedConfig);
        Object.assign(GITHUB_CONFIG, parsedConfig);
    } catch (error) {
        console.error('Error loading GitHub configuration:', error);
    }
}

// Make it globally available
window.GITHUB_CONFIG = GITHUB_CONFIG;

// Instructions for setup
const SETUP_INSTRUCTIONS = `
إعداد GitHub Storage:

1. إنشاء Personal Access Token:
   - اذهب إلى GitHub Settings → Developer settings → Personal access tokens
   - انقر على "Generate new token"
   - اختر الأذونات: repo (full control)
   - انسخ الـ token

2. تحديث الإعدادات:
   - افتح ملف config.js
   - أدخل username الخاص بك
   - أدخل اسم المستودع
   - أدخل الـ token
   - غير enabled إلى true

3. إنشاء مجلد data:
   - أنشئ مجلد اسمه "data" في المستودع
   - هذا المجلد سيحتوي على ملف البيانات

مثال:
const GITHUB_CONFIG = {
    username: 'your-username',
    repo: 'golden-ice-cream-shop',
    token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    enabled: true
};
`;

console.log(SETUP_INSTRUCTIONS);