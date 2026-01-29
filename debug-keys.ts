/**
 * Debug script for Ed25519 signature verification
 */

import nacl from 'tweetnacl';

// Keys from env-master.txt
const PRIVATE_KEY_HEX = 'e0c2017c6999245e4548d1c9e8839081e77f0a8c2f10b0646c0ca4988f6c4068597371d34c6792f3929424a737f44d156540c49980d46797a29a0714138e9c9c';
const PUBLIC_KEY_HEX = '597371d34c6792f3929424a737f44d156540c49980d46797a29a0714138e9c9c';

console.log('='.repeat(60));
console.log('  Ed25519 Debug Test');
console.log('='.repeat(60));
console.log();

// Test 1: Simple message signing
console.log('Test 1: Simple message signing');
console.log('-'.repeat(40));

const privateKey = Buffer.from(PRIVATE_KEY_HEX, 'hex');
const publicKey = Buffer.from(PUBLIC_KEY_HEX, 'hex');

console.log('Private key length:', privateKey.length, 'bytes');
console.log('Public key length:', publicKey.length, 'bytes');

// Simple test message
const message = Buffer.from('Hello World!');
console.log('Message:', message.toString());

// Sign
const signature = nacl.sign.detached(
    new Uint8Array(message),
    new Uint8Array(privateKey)
);
console.log('Signature length:', signature.length, 'bytes');

// Verify with our public key
const isValid = nacl.sign.detached.verify(
    new Uint8Array(message),
    signature,
    new Uint8Array(publicKey)
);
console.log('Verification result:', isValid ? '✅ VALID' : '❌ INVALID');
console.log();

// Test 2: Check if keys are properly paired
console.log('Test 2: Generate key pair from seed');
console.log('-'.repeat(40));

// In Ed25519, the private key (64 bytes) contains the seed (32 bytes) + public key (32 bytes)
const seedFromPrivKey = privateKey.subarray(0, 32);
const pubKeyFromPrivKey = privateKey.subarray(32, 64);

console.log('Seed (first 32 bytes of privkey):', seedFromPrivKey.toString('hex'));
console.log('PubKey from PrivKey (last 32):', pubKeyFromPrivKey.toString('hex'));
console.log('Provided PubKey:', PUBLIC_KEY_HEX);
console.log('Match:', pubKeyFromPrivKey.toString('hex') === PUBLIC_KEY_HEX ? '✅ YES' : '❌ NO');
console.log();

// Test 3: Generate fresh key pair and test
console.log('Test 3: Fresh key pair test');
console.log('-'.repeat(40));

const newPair = nacl.sign.keyPair();
console.log('New Public Key:', Buffer.from(newPair.publicKey).toString('hex'));
console.log('New Secret Key:', Buffer.from(newPair.secretKey).toString('hex'));

const sig2 = nacl.sign.detached(new Uint8Array(message), newPair.secretKey);
const valid2 = nacl.sign.detached.verify(new Uint8Array(message), sig2, newPair.publicKey);
console.log('Fresh pair verification:', valid2 ? '✅ VALID' : '❌ INVALID');
console.log();

console.log('='.repeat(60));
