/**
 * Generate new Ed25519 key pair for GhostMicro
 * Run: npx tsx generate-keys.ts
 */

import nacl from 'tweetnacl';

console.log('='.repeat(60));
console.log('  GhostMicro Key Pair Generator');
console.log('='.repeat(60));
console.log();

// Generate new key pair
const keyPair = nacl.sign.keyPair();

const publicKeyHex = Buffer.from(keyPair.publicKey).toString('hex');
const privateKeyHex = Buffer.from(keyPair.secretKey).toString('hex');

console.log('🔑 New Key Pair Generated!');
console.log();
console.log('Copy these to your .env.local:');
console.log('-'.repeat(60));
console.log();
console.log(`SERIAL_PRIVATE_KEY=${privateKeyHex}`);
console.log();
console.log(`NEXT_PUBLIC_SERIAL_PUBLIC_KEY=${publicKeyHex}`);
console.log();
console.log('-'.repeat(60));

// Verification test
console.log();
console.log('🔍 Verification Test...');
const testMsg = Buffer.from('test message');
const sig = nacl.sign.detached(new Uint8Array(testMsg), keyPair.secretKey);
const valid = nacl.sign.detached.verify(new Uint8Array(testMsg), sig, keyPair.publicKey);
console.log('Result:', valid ? '✅ Keys are valid!' : '❌ Keys are invalid!');
console.log();
console.log('='.repeat(60));
