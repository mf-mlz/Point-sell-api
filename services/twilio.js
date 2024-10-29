const twilio = require("twilio");

const client = twilio(process.env.SID, process.env.TOKEN_T);

const sendSms = async (phone, code) => {
  try {
    const message = await client.messages.create({
      body: `Su código de Autenticación es: ${code}`,
      from: "+12566395883",
      to: phone,
    });

    const lastFourDigits = message.to.slice(-4);
    const maskedPhone =
      message.to.slice(0, -4).replace(/\d/g, "*") + lastFourDigits;

    return {
      status: true,
      message: `Código Enviado con Éxito al número: ${maskedPhone}`,
    };
  } catch (error) {
    return {
      status: false,
      error: error.message,
    };
  }
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
  sendSms,
  generateCodeAuthSms,
};
