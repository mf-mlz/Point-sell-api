const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { deleteFile } = require("../utils/files");
const { decryptCrypt } = require("../utils/crypto-js");

/* Key ECDSA (ES256) */
const pubKey = fs.readFileSync(
  path.join(process.cwd(), process.env.KNP),
  "utf8"
);

/* Verify JWT => Api Peticion */
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    if (req.file) {
      deleteFile(req.file)
        .then(() => {
          return res
            .status(401)
            .json({ message: "Acceso denegado: Falló la Autenticación" });
        })
        .catch((error) => {
          return res
            .status(401)
            .json({ message: "Acceso denegado: Falló la Autenticación" });
        });
    } else {
      return res
        .status(401)
        .json({ message: "Acceso denegado: Falló la Autenticación" });
    }
  } else {
    try {
      jwt.verify(token, pubKey, { algorithms: ["ES256"] }, (err, decoded) => {
        if (err) {
          if (req.file) {
            deleteFile(req.file)
              .then(() => {
                return res
                  .status(401)
                  .json({ message: "Acceso denegado: Falló la Autenticación" });
              })
              .catch((error) => {
                return res
                  .status(401)
                  .json({ message: "Acceso denegad: Falló la Autenticación" });
              });
          } else {
            return res
              .status(401)
              .json({ message: "Acceso denegado: Falló la Autenticación" });
          }
        } else {
          next();
        }
      });
    } catch (err) {
      console.log(err);
      
      res.status(401).json({ message: "Acceso Inválido" });
    }
  }
};

/* Verify Token Validation and Header => Guard Routes and Data Session Storage */
const validationToken = (req, res, next) => {
  const token = req.cookies.token;
  let userSessionEncrypt = req.headers["session-employee"];
  userSessionEncrypt = userSessionEncrypt ? userSessionEncrypt.replace(/['"]+/g, '') : null;

  const payloadEncrypt = jwt.decode(token);

  /* Headers or Token Not Found */
  if (!userSessionEncrypt || !token) {
    return res.status(401).json({ status: false, data: {} });
  } else {
    try {
      /* Verify Is Valid Token */
      jwt.verify(token, pubKey, { algorithms: ["ES256"] }, (err, decoded) => {
        if (err) {
          return res.status(401).json({ status: false, data: {} });
        } else {
          /* Verify Payload == User Session */
          /* Desencryp Payload and Session Employee */
          let payload = decryptCrypt(payloadEncrypt.data);
          let userSession = decryptCrypt(userSessionEncrypt);
          
          if (!validateDecodedToken(userSession, payload)) {
            return res.status(401).json({ status: false, data: {} });
          }else{
            return res.status(200).json({ status: true, data: userSessionEncrypt });
          }
        }
      });
    } catch (err) {
      return res.status(401).json({ status: false, data: {} });
    }
  }
};

/* Verify Payload */
const validateDecodedToken = (userSession, payload) => {
  if (
    userSession.id === payload.id &&
    userSession.name === payload.name &&
    userSession.role_name === payload.role_name
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  verifyToken,
  validationToken,
};
