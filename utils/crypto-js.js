const CryptoJS = require("crypto-js");
const secretKey = process.env.CRYPTO;

const encryptCrypt = (payload) => {
  const encryptedPayload = CryptoJS.AES.encrypt(payload, secretKey).toString();
  return encryptedPayload;
};

function decryptCrypt(payloadEncrypt) {
  const data = CryptoJS.AES.decrypt(payloadEncrypt, secretKey);
  const decryptedString = data.toString(CryptoJS.enc.Utf8);
  try {
    const decryptedData = JSON.parse(decryptedString);
    return decryptedData; 
  } catch (error) {
    return decryptedString;
  }
}

module.exports = {
  encryptCrypt,
  decryptCrypt,
};
