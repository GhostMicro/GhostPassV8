/**
 * Test script to verify serial key generation and verification
 * Run with: npx ts-node test-serial.ts
 */

import { generateSerialKey, verifyAndUnpackSerial, SerialPayload } from './lib/serial-utils';

// Keys from env-master.txt
const PRIVATE_KEY = 'e0c2017c6999245e4548d1c9e8839081e77f0a8c2f10b0646c0ca4988f6c4068597371d34c6792f3929424a737f44d156540c49980d46797a29a0714138e9c9c';
const PUBLIC_KEY = '597371d34c6792f3929424a737f44d156540c49980d46797a29a0714138e9c9c';

console.log('='.repeat(60));
console.log('  GhostMicro Serial Key Test v3.0');
console.log('='.repeat(60));
console.log();

// Test payload
const payload: SerialPayload = {
    productId: 1,
    version: 1,
    userLevel: 0,
    appId: 0,
    expiry: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year
    hardwareId: 0, // Any device
};

console.log('📦 Payload:');
console.log(JSON.stringify(payload, null, 2));
console.log();

// Generate key
console.log('🔑 Generating serial key...');
try {
    const serial = generateSerialKey(payload, PRIVATE_KEY);
    console.log('✅ Serial Key:');
    console.log(serial);
    console.log();

    // Verify key
    console.log('🔍 Verifying serial key...');
    try {
        const decoded = verifyAndUnpackSerial(serial, PUBLIC_KEY);
        console.log('✅ Verification SUCCESS!');
        console.log('📦 Decoded Payload:');
        console.log(JSON.stringify(decoded, null, 2));
    } catch (verifyError: any) {
        console.log('❌ Verification FAILED:', verifyError.message);
    }
} catch (genError: any) {
    console.log('❌ Generation FAILED:', genError.message);
}

console.log();
console.log('='.repeat(60));
