#!/usr/bin/env node

/**
 * Secret Generator Script
 * Generates secure random strings for JWT_SECRET and ENCRYPTION_KEY
 * 
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating Secure Secrets for TagAlong\n');
console.log('=' .repeat(60));

// Generate JWT Secret (32+ characters, base64 encoded)
const jwtSecret = crypto.randomBytes(32).toString('base64');
console.log('\n✅ JWT_SECRET (32+ characters):');
console.log(jwtSecret);
console.log(`\n   Length: ${jwtSecret.length} characters`);

// Generate Encryption Key (exactly 32 characters, hex)
const encryptionKey = crypto.randomBytes(16).toString('hex');
console.log('\n✅ ENCRYPTION_KEY (exactly 32 characters):');
console.log(encryptionKey);
console.log(`\n   Length: ${encryptionKey.length} characters`);

console.log('\n' + '='.repeat(60));
console.log('\n📝 Copy these values to your .env file:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('\n⚠️  Keep these secrets secure and never commit them to Git!\n');

