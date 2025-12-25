/**
 * AES-256-GCM encryption for private keys
 * Format: iv:ciphertext:authTag (all base64)
 */

export async function encrypt(plaintext: string, keyHex: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBuffer(keyHex),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const ciphertextArray = new Uint8Array(ciphertext);
  // GCM appends 16-byte auth tag to ciphertext
  const encrypted = ciphertextArray.slice(0, -16);
  const authTag = ciphertextArray.slice(-16);

  return `${bufferToBase64(iv)}:${bufferToBase64(encrypted)}:${bufferToBase64(authTag)}`;
}

export async function decrypt(encrypted: string, keyHex: string): Promise<string> {
  const [ivB64, ciphertextB64, authTagB64] = encrypted.split(":");

  if (!ivB64 || !ciphertextB64 || !authTagB64) {
    throw new Error("Invalid encrypted format");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    hexToBuffer(keyHex),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const iv = base64ToBuffer(ivB64);
  const ciphertext = base64ToBuffer(ciphertextB64);
  const authTag = base64ToBuffer(authTagB64);

  // Combine ciphertext + authTag for decryption
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    combined
  );

  return new TextDecoder().decode(decrypted);
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function bufferToBase64(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer));
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
