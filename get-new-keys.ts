import nacl from 'tweetnacl';

function generateNewKeys() {
    const pair = nacl.sign.keyPair();
    const pub = Buffer.from(pair.publicKey).toString('hex');
    const priv = Buffer.from(pair.secretKey).toString('hex');

    console.log("====================================================");
    console.log("✨ GHOSTMICRO NEW SECURE KEY PAIR ✨");
    console.log("====================================================");
    console.log("Copy these to your .env.local file:");
    console.log("");
    console.log(`SERIAL_PRIVATE_KEY=${priv}`);
    console.log(`NEXT_PUBLIC_SERIAL_PUBLIC_KEY=${pub}`);
    console.log("");
    console.log("⚠️ After updating .env.local, RESTART your server!");
    console.log("====================================================");
}

generateNewKeys();
