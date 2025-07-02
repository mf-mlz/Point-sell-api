const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const permissionsRoutes = require("./modules/permissions/routes/permissionsRoutes");
const clientsRoutes = require("./modules/clients/routes/clientRoutes");
const employeesRoutes = require("./modules/employees/routes/employeesRoutes");
const productsRoutes = require("./modules/products/routes/productsRoutes");
const rolesRoutes = require("./modules/roles/routes/rolesRoutes");
const salesRoutes = require("./modules/sales/routes/salesRoutes");
const salesProductsRoutes = require("./modules/salesProducts/routes/salesProductsRoutes");
const invoicesRoutes = require("./modules/invoices/routes/invoicesRoutes");
const modulesRoutes = require("./modules/modules/routes/modulesRoutes");
const submodulesRoutes = require("./modules/submodules/routes/submodulesRoutes");
const paymentsFormRoutes = require("./modules/paymentsForm/routes/paymentsFormRoutes");

const { requestLogger } = require("./middlewares/logMiddleware");
const validator = require("./services/jwt");
const { initSocket } = require("./services/sockets");

const dotenv = require("dotenv");
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   handler: (req, res) => {
//     return res.status(429).json({ error: "Ocurrió un error en la petición" });
//   },
//   headers: true,
// });

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "session-employee", "module-role"],
    credentials: true,
  })
);

// app.use(limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));
app.use(requestLogger);
app.use(cookieParser());

app.use("/api/validate", validator);
app.use("/api/clients", clientsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/salesproducts", salesProductsRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/paymentsform", paymentsFormRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/submodules", submodulesRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res
      .status(413)
      .json({ error: "Ocurrió un Error en el Tamaño de la Solicitud" });
  }
  next(err);
});

let server;
if (process.env.NODE_ENV === "production") {
  const privateKey = fs.readFileSync("/ruta/a/privkey.pem", "utf8");
  const certificate = fs.readFileSync("/ruta/a/cert.pem", "utf8");
  server = https.createServer({ key: privateKey, cert: certificate }, app);
} else {
  server = http.createServer(app);
}

initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
});
