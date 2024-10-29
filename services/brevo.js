const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.KEY_B;
let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();
let sendTransacSms = new SibApiV3Sdk.SendTransacSms();

const authSms = (phone, code) => {
  const sendTransacSms = {
    sender: "CMCOEM",
    recipient: phone,
    content: `Su código de Autenticación es: ${code}`,
  };

  return apiInstance
    .sendTransacSms(sendTransacSms)
    .then((data) => ({
      status: true,
      data: data,
    }))
    .catch((error) => ({
      status: false,
      error: error?.message || "Ocurrió un error al enviar el SMS",
    }));
};

const generateCodeAuthSms = async () => {
  let code = "";
  for (let index = 0; index < 6; index++) {
    let number = Math.floor(Math.random() * 10);
    code += number.toString();
  }

  return code;
};

module.exports = {
  authSms,
  generateCodeAuthSms,
};
