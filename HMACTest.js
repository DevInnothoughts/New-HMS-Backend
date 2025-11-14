const crypto = require("crypto");

class HMACUtil {
  /**
   * Compute HMAC-SHA512 with hex key
   * @param {string} message - Plain message (string)
   * @param {string} signatureKeyHex - Secret key in HEX
   * @returns {string} Base64 encoded HMAC
   */
  static computeHMAC(message, signatureKeyHex) {
    const key = Buffer.from(signatureKeyHex, "hex"); // Convert hex key to bytes

    const hmac = crypto.createHmac("sha512", key);
    hmac.update(message, "utf8");

    return hmac.digest("base64"); // Return Base64 string
  }
}

// 🔹 Demo usage
const message =
  '{"transactionDetails":"45D4E0FCD2867F813912364C48401B21582A0DEE2D760175ACC3A8FCCFF3540325EA36408D2C04C2F28C2B3098B6A521FF137F94101D8F0E0A97A9B20492AE3F11D5056C6BA340CAC8172F782E0DA50F43B9B52E00D6A61D0C76599743D61DF3F2BBDE97D20486BDD0BC1A23C7565E5CAF4AB4D06D0234F355A7A4D068D4AC68C28CE86AEE5C0AC840C4A0465356355FB92F296159E062CF1C3A4969BBBF0DE002A56E47B306BBD0EADD432B0822BDBD7544759D17781E7E1418F0E67578FE9E816BC891CCF1552B4E5F02C2C8FC5FDF0212FA46D3CCCBA9"}';

const keyHex =
  "E59B657C387B15FFAA74D79ADBBAAC53774E455DF7490A1026CC434FCD175AFC";

console.log("HMAC:", HMACUtil.computeHMAC(message, keyHex));

class AESGCMUtil {
  static AES_KEY_SIZE = 256;
  static GCM_IV_LENGTH = 12; // 12 bytes = 96 bits
  static GCM_TAG_LENGTH = 16; // 16 bytes = 128 bits

  /**
   * Encrypt plaintext using AES/GCM/NoPadding
   * @param {string} plainText - The text to encrypt
   * @param {string} secKeyHex - Secret key in hex (32 bytes / 64 hex chars for AES-256)
   * @param {string} ivHex - IV in hex (12 bytes / 24 hex chars)
   * @returns {string} - Ciphertext in HEX
   */
  static encrypt(plainText, secKeyHex, ivHex) {
    const key = Buffer.from(secKeyHex, "hex");
    const iv = Buffer.from(ivHex, "hex");

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encrypted = cipher.update(plainText, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const tag = cipher.getAuthTag();

    // Append tag (same as Java auto-handling GCM tag)
    return Buffer.concat([encrypted, tag]).toString("hex").toUpperCase();
  }

  /**
   * Decrypt ciphertext using AES/GCM/NoPadding
   * @param {string} encHexString - Ciphertext (Hex, includes authentication tag at the end)
   * @param {string} secKeyHex - Secret key in hex
   * @param {string} ivHex - IV in hex
   * @returns {string} - Decrypted plaintext
   */
  static decrypt(encHexString, secKeyHex, ivHex) {
    const key = Buffer.from(secKeyHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const data = Buffer.from(encHexString, "hex");

    // Last 16 bytes = Auth Tag
    const tag = data.slice(data.length - this.GCM_TAG_LENGTH);
    const encryptedData = data.slice(0, data.length - this.GCM_TAG_LENGTH);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedData, null, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

// 🔹 Demo usage
const plainText = "HHCPL-IHX";
//'{"userName": "9730438137","password": "1321","invoiceNo": "123425345435","transactionAmount": "10","transactionType": "1","upiAddress": "9730304073@ybl","payerName": "Shubham","autoInitiateFlag": "N"}';

// Example 256-bit AES key (64 hex chars)
const secretKeyHex =
  "2921891879479EA617E2E598ACDBBAAF4F46B342152BE9B7D316C60B999F1185";

// Example 12-byte IV (24 hex chars)
const ivHex = "5604E9CEDD813A665CDF6989";

console.log("Plaintext:", plainText);

// Encrypt
const cipherHex = AESGCMUtil.encrypt(plainText, secretKeyHex, ivHex);
console.log("Encrypted (Hex):", cipherHex);

// Decrypt
const decrypted = AESGCMUtil.decrypt(cipherHex, secretKeyHex, ivHex);
console.log("Decrypted:", decrypted);

/**
 * Compute SHA-512 hash of concatenated fields.
 * Fields are concatenated in the order: userId + billNumber + transactionId + merchantId + key
 * @param {string} userId
 * @param {string} billNumber
 * @param {string} transactionId
 * @param {string} merchantId
 * @param {string} merchantKeyOrEnterpriseKey
 * @returns {string} hex-encoded SHA-512 digest
 */
function computeSignatureSHA512(
  userId,
  billNumber,
  transactionId,
  merchantId,
  merchantKeyOrEnterpriseKey
) {
  if (
    [
      userId,
      billNumber,
      transactionId,
      merchantId,
      merchantKeyOrEnterpriseKey,
    ].some((v) => v === undefined || v === null)
  ) {
    throw new Error("All five inputs are required.");
  }

  // Normalize inputs to strings and trim (optional)
  const str =
    String(userId).trim() +
    String(billNumber).trim() +
    String(transactionId).trim() +
    String(merchantId).trim() +
    String(merchantKeyOrEnterpriseKey).trim();

  const hash = crypto.createHash("sha512").update(str, "utf8").digest("hex");
  return hash;
}

// Example usage:
const sig = computeSignatureSHA512(
  "9730438137",
  "123425345435",
  "14024",
  "175549986712EYJ9O1M",
  "CD666DB7308A9FF917894CB698CA6A287ADC683A8C78A840"
);
console.log("SHA-512 signature (hex):", sig);
