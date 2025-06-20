#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Simple API Project Setup');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file from template...');
    try {
        const envContent = fs.readFileSync(envExamplePath, 'utf8');
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created successfully!');
        console.log('⚠️  Please update the JWT_SECRET in .env file for security.\n');
    } catch (error) {
        console.error('❌ Error creating .env file:', error.message);
    }
} else {
    console.log('✅ .env file already exists.\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    console.log('Run: npm install\n');
} else {
    console.log('✅ Dependencies are installed.\n');
}

console.log('🎯 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Update .env file with your MongoDB connection string');
console.log('3. Run: npm install (if not done already)');
console.log('4. Run: npm run dev (for development)');
console.log('5. Run: npm start (for production)');
console.log('6. Open http://localhost:3000 in your browser');
console.log('7. Test the API with the provided HTML interface\n');

console.log('📚 Available endpoints:');
console.log('- POST /api/auth/register - Register a new user');
console.log('- POST /api/auth/login - Login user');
console.log('- GET /api/auth/profile - Get user profile (protected)');
console.log('- GET /api/posts - Get all posts');
console.log('- POST /api/posts - Create new post (protected)');
console.log('- GET /api/users - Get all users (protected, admin only)');
console.log('- GET /health - Health check\n');

console.log('🔧 For testing, you can also run: node test-api.js'); 