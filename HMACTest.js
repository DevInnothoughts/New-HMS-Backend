const crypto = require("crypto");

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
// const plainText =
//   '{"deviceSerialNo":"P10A6241226003300","deviceIdentifier":"9730438137"}';
const plainText =
  '{"userName":"9730438137","password":"1321","invoiceNo":"123425345435","transactionAmount":"10","transactionType":"1","upiAddress":"9730304073@ybl","payerName":"Shubham","autoInitiateFlag":"N"}';
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
  '{"notificationIdentifier":"9730438137","webTransactionId":"13802","transactionMessage":"transaction details published successfully."}';
//"1A4F9A840AD88DDC6C898042F814A53E5987ED403D837FE4D60739CE8CC09B03EAB1788C32CCC2FF5E0FDC08E130D176EB21A032B4563FE43E5380E722DF0455AC5611965530595140695E248460A9FF45571C96E259FE41C52587D761EA09655D0BCB8E3D50A3336C173D79AF85A1515506F1C1017D8DA67D3DB5BAEF350309EE68417C5443EF098A3BEA199227B62B5A86EB3FD97F861E241B814CC3297DAA3BEC338319EA8E9240AB7650";

const keyHex =
  "E59B657C387B15FFAA74D79ADBBAAC53774E455DF7490A1026CC434FCD175AFC";

console.log("HMAC:", HMACUtil.computeHMAC(message, keyHex));
