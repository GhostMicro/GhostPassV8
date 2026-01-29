import { WORDLIST_2048 } from './data';

/**
 * 🛠️ GHOSTPASS v8.2 Engine
 * Implements the 12-Word Rule:
 * 1. Role, 2. Type, 3. Name, 4. [Future], 5. Version, 6. Model,
 * 7. Production, 8. Activation, 9. Expiry, 10. SKU, 11. [Future], 12. Security
 */

export interface GhostPassData {
    role: number;       // 0-2047
    type: number;       // 0-2047
    name: number;       // 0-2047
    reserved1: number;  // 4th (Future)
    version: number;    // 0-2047
    model: number;      // 0-2047
    prodDate: number;   // 0-2047
    actDate: number;    // 0-2047
    expiryDate: number; // 0-2047
    sku: number;        // 0-2047
    reserved2: number;  // 11th (Future)
}

// Security Checksum calculation (Word 12)
function calculateChecksum(indices: number[], masterSecret: string): number {
    // Combine indices with masterSecret for a unique signature
    const dataString = indices.join('-') + masterSecret;

    // Simple hash-like sum with secret
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
        const char = dataString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash) % 2048;
}

// Helper to generate a stable salt for each position (v8.2 Algorithm)
function getPositionSalt(index: number, secret: string): number {
    const saltStr = `${secret}_pos_${index}_v8.2`;
    let h1 = 0x811c9dc5; // FNV offset basis
    for (let i = 0; i < saltStr.length; i++) {
        h1 ^= saltStr.charCodeAt(i);
        h1 = (h1 * 0x01000193) | 0; // FNV prime
    }
    // Final mixing for high entropy
    h1 ^= h1 >>> 16;
    h1 = (h1 * 0x85ebca6b) | 0;
    h1 ^= h1 >>> 13;
    h1 = (h1 * 0xc2b2ae35) | 0;
    h1 ^= h1 >>> 16;

    return Math.abs(h1) % 2048;
}

/**
 * 🔑 Encode: Data Object -> 12 Word Phrase
 */
export function encodeGhostPass(data: GhostPassData, masterSecret: string): string[] {
    const rawIndices = [
        data.role,
        data.type,
        data.name,
        data.reserved1,
        data.version,
        data.model,
        data.prodDate,
        data.actDate,
        data.expiryDate,
        data.sku,
        data.reserved2
    ];

    // Scramble: Apply position-based salt to each word
    const scrambledIndices = rawIndices.map((val, i) => {
        const salt = getPositionSalt(i, masterSecret);
        return (val + salt) % 2048;
    });

    const checksum = calculateChecksum(scrambledIndices, masterSecret);
    scrambledIndices.push(checksum);

    return scrambledIndices.map(idx => WORDLIST_2048[idx]);
}

/**
 * 🔍 Decode: 12 Word Phrase -> Data Object (with validation)
 */
export function decodeGhostPass(phrase: string[], masterSecret: string): { data: GhostPassData; valid: boolean } {
    if (phrase.length !== 12) throw new Error("Invalid phrase length. Must be 12 words.");

    const scrambledIndices = phrase.map(word => {
        const idx = WORDLIST_2048.indexOf(word.toLowerCase().trim());
        if (idx === -1) throw new Error(`Word not in wordlist: ${word}`);
        return idx;
    });

    const dataIndices = scrambledIndices.slice(0, 11);
    const providedChecksum = scrambledIndices[11];
    const expectedChecksum = calculateChecksum(dataIndices, masterSecret);

    const isValid = providedChecksum === expectedChecksum;

    // Unscramble: Remove salt to recover original data
    const rawIndices = dataIndices.map((val, i) => {
        const salt = getPositionSalt(i, masterSecret);
        // Correctly handle negative modulo in JS: ((val - salt) % 2048 + 2048) % 2048
        return ((val - salt) % 2048 + 2048) % 2048;
    });

    return {
        valid: isValid,
        data: {
            role: rawIndices[0],
            type: rawIndices[1],
            name: rawIndices[2],
            reserved1: rawIndices[3],
            version: rawIndices[4],
            model: rawIndices[5],
            prodDate: rawIndices[6],
            actDate: rawIndices[7],
            expiryDate: rawIndices[8],
            sku: rawIndices[9],
            reserved2: rawIndices[10]
        }
    };
}

/**
 * 📅 Date Helper: Simple YYMMDD to Number (0-2047)
 * Since we only have 11 bits (2048 values) per word, we use a compact format or reference.
 * For now, assume users pass raw index values. 
 */
