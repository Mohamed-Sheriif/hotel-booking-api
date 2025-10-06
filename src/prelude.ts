// Ensure global crypto (for libraries expecting crypto.randomUUID in Node.js)
// This sets globalThis.crypto to Node's webcrypto if it's missing.
const globalObject = globalThis as unknown as { [key: string]: unknown };

if (
  !globalObject.crypto ||
  typeof (globalObject.crypto as { [key: string]: unknown }).randomUUID !==
    'function'
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { webcrypto } = require('node:crypto');
    globalObject.crypto = webcrypto;
  } catch (_) {
    // If webcrypto is unavailable, leave as-is; downstream code may handle it.
  }
}
