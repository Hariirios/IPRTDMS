/**
 * Password Hash Generator
 * 
 * This script generates a bcrypt hash for a password.
 * Use this to create password hashes for inserting admin users into the database.
 * 
 * Usage:
 *   node scripts/generate-password-hash.js YourPassword123!
 */

const bcrypt = require('bcryptjs');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
    console.error('❌ Error: Please provide a password as an argument');
    console.log('\nUsage:');
    console.log('  node scripts/generate-password-hash.js YourPassword123!');
    process.exit(1);
}

// Validate password strength
if (password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long');
    process.exit(1);
}

// Generate hash
console.log('\n🔐 Generating password hash...\n');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('✅ Password hash generated successfully!\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\n📋 SQL to insert admin user:\n');
console.log(`INSERT INTO admin_users (email, username, password_hash, role, is_active, created_by)
VALUES (
    'your-email@example.com',
    'your-username',
    '${hash}',
    'super_admin',
    true,
    'system'
);`);
console.log('\n⚠️  Remember to:');
console.log('1. Replace the email and username with your actual values');
console.log('2. Run this SQL in your Supabase SQL Editor');
console.log('3. Keep your password secure!\n');
