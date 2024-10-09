const CryptoJS = require("crypto-js");
const secretKey = process.env.CRYPTO;

const encryptCrypt = (payload) => {
  const encryptedPayload = CryptoJS.AES.encrypt(payload,
    secretKey
  ).toString();
  return encryptedPayload;
};

function decryptCrypt(payloadEncrypt) {
  const data = CryptoJS.AES.decrypt(payloadEncrypt, secretKey);
  const decryptedData = JSON.parse(data.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

module.exports = {
  encryptCrypt,
  decryptCrypt,
};
