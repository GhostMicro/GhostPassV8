import nacl from 'tweetnacl';
import * as fs from 'fs';
import * as path from 'path';
import { generateSerialKey, verifyAndUnpackSerial, SerialPayload } from './lib/serial-utils';

/**
 * 🚨 EMERGENCY SYSTEM RESET v4.0
 */

async function reset() {
    console.log("====================================================");
    console.log("🛰️ GHOSTMICRO EMERGENCY RESET INITIATED...");
    console.log("====================================================");

    // 1. Generate guaranteed valid key pair
    const pair = nacl.sign.keyPair();
    const privHex = Buffer.from(pair.secretKey).toString('hex');
    const pubHex = Buffer.from(pair.publicKey).toString('hex');

    console.log("✅ New Key Pair Generated.");

    // 2. Update .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = `SERIAL_PRIVATE_KEY=${privHex}\nNEXT_PUBLIC_SERIAL_PUBLIC_KEY=${pubHex}\n`;

    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env.local updated with new keys.");

    // 3. Self-Test v4.0 Logic
    console.log("\n🔍 Running Logic Self-Test...");

    const testPayload: SerialPayload = {
        productId: 99,
        version: 1,
        userLevel: 7, // PLATFORM
        appId: 1,    // MicroCore
        expiry: Math.floor(Date.now() / 1000) + 3600,
        hardwareId: 0xABCDEF01
    };

    try {
        const serial = generateSerialKey(testPayload, privHex);
        console.log("🔑 Test Serial Generated:", serial);

        const decoded = verifyAndUnpackSerial(serial, pubHex);
        if (decoded.productId === 99 && decoded.hardwareId === 0xABCDEF01) {
            console.log("🎊 SYSTEM TEST PASSED! v4.0 Logic is 100% Correct.");
        } else {
            console.log("❌ TEST FAILED: Data mismatch.");
        }
    } catch (e: any) {
        console.log("❌ TEST FAILED:", e.message);
    }

    console.log("\n====================================================");
    console.log("📢 NEXT STEPS:");
    console.log("1. Close the current 'npm run dev' terminal.");
    console.log("2. Open a NEW terminal and run 'npm run dev'.");
    console.log("3. Test through the Web UI.");
    console.log("====================================================");
}

reset();
