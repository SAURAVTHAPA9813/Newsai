#!/usr/bin/env node

/**
 * JWT Secret Generator
 *
 * Generates a cryptographically secure random string for use as JWT_SECRET
 *
 * Usage:
 *   node generate-jwt-secret.js
 *
 * The generated secret is suitable for production use.
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Generator\n');
console.log('Generating cryptographically secure random secret...\n');

// Generate 64 random bytes and convert to hex string (128 characters)
const secret = crypto.randomBytes(64).toString('hex');

console.log('✅ Generated JWT Secret:\n');
console.log(secret);
console.log('\n');
console.log('📋 Copy this to your .env file:\n');
console.log(`JWT_SECRET=${secret}`);
console.log('\n');
console.log('⚠️  IMPORTANT:');
console.log('- Never commit this secret to version control');
console.log('- Use different secrets for development and production');
console.log('- Keep this secret safe - it\'s used to sign authentication tokens');
console.log('- If compromised, generate a new secret (will invalidate all existing tokens)');
console.log('\n');
