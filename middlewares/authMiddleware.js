const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { deleteFile } = require("../utils/files");
/* Key ECDSA (ES256) */
const pubKey = fs.readFileSync(
  path.join(process.cwd(), process.env.KNP),
  "utf8"
);

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
      res.status(401).json({ message: "Acceso Inválido" });
    }
  }
};

module.exports = {
  verifyToken,
};
