import { generateKeyPair, generateSerialKey, SerialPayload } from './lib/serial-utils';

async function test() {
    console.log("Generating KeyPair...");
    const keys = generateKeyPair();
    console.log("Public Key:", keys.publicKey);
    console.log("Private Key:", keys.privateKey);

    const payload: SerialPayload = {
        productId: 1234,
        version: 1,
        expiry: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
        hardwareId: 0xDEADBEEF,
    };

    console.log("\nGenerating Serial...");
    const serial = generateSerialKey(payload, keys.privateKey);
    console.log("Serial Key:", serial);
}

test().catch(console.error);
