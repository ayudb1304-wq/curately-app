/**
 * Encryption Utility for Curately Creator OS
 * 
 * Implements AES-256-GCM encryption for securing OAuth tokens at rest.
 * This is mandatory for storing social platform refresh tokens securely.
 * 
 * Security Notes:
 * - Uses crypto.createCipheriv with AES-256-GCM (authenticated encryption)
 * - Generates unique IV for each encryption operation
 * - Stores auth tag alongside ciphertext for integrity verification
 * - Requires ENCRYPTION_KEY env var (32 bytes / 64 hex chars)
 */

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // GCM recommended IV length
const AUTH_TAG_LENGTH = 16;

/**
 * Get the encryption key from environment variables.
 * Key must be 32 bytes (256 bits) provided as 64 hex characters.
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY environment variable is not set. " +
      "Generate one with: openssl rand -hex 32"
    );
  }

  if (key.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be 64 hex characters (32 bytes). " +
      "Generate one with: openssl rand -hex 32"
    );
  }

  return Buffer.from(key, "hex");
}

/**
 * Encrypts a plaintext token using AES-256-GCM.
 * 
 * @param plaintext - The token to encrypt (e.g., OAuth refresh token)
 * @returns Encrypted string in format: iv:authTag:ciphertext (all base64)
 * 
 * @example
 * const encrypted = encryptToken(refreshToken);
 * // Store `encrypted` in database
 */
export function encryptToken(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:ciphertext (all base64 encoded)
  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

/**
 * Decrypts a token that was encrypted with encryptToken.
 * 
 * @param encryptedData - The encrypted string from encryptToken
 * @returns The original plaintext token
 * @throws Error if decryption fails (invalid data, wrong key, or tampering)
 * 
 * @example
 * const refreshToken = decryptToken(encryptedFromDb);
 */
export function decryptToken(encryptedData: string): string {
  const key = getEncryptionKey();
  const parts = encryptedData.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }

  const [ivBase64, authTagBase64, ciphertextBase64] = parts;

  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  const ciphertext = Buffer.from(ciphertextBase64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Safely encrypts a token, returning null if the input is null/undefined.
 * Useful for optional token fields.
 */
export function encryptTokenSafe(plaintext: string | null | undefined): string | null {
  if (!plaintext) return null;
  return encryptToken(plaintext);
}

/**
 * Safely decrypts a token, returning null if the input is null/undefined.
 * Useful for optional token fields.
 */
export function decryptTokenSafe(encryptedData: string | null | undefined): string | null {
  if (!encryptedData) return null;
  return decryptToken(encryptedData);
}

