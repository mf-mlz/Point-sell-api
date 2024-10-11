const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const permissionsRoutes = require('./modules/permissions/routes/permissionsRoutes');
const clientsRoutes = require('./modules/clients/routes/clientRoutes');
const employeesRoutes = require('./modules/employees/routes/employeesRoutes');
const productsRoutes = require('./modules/products/routes/productsRoutes');
const rolesRoutes = require('./modules/roles/routes/rolesRoutes');
const salesRoutes = require('./modules/sales/routes/salesRoutes');
const salesProductsRoutes = require('./modules/salesProducts/routes/salesProductsRoutes');
const invoicesRoutes = require('./modules/invoices/routes/invoicesRoutes');
const { requestLogger } = require('./middlewares/logMiddleware');
const paymentsFormRoutes = require('./modules/paymentsForm/routes/paymentsFormRoutes');
const cookieParser = require('cookie-parser');

const validator = require('./services/jwt');

dotenv.config();

const app = express();

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, 
//     max: 100, 
//     handler: (req, res) => {
//         return res.status(429).json({ error: 'Ocurrió un error en la petición'});
//     },
//     headers: true, 
//   });

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'session-employee'],
    credentials: true
}));


// app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(requestLogger);
app.use(cookieParser());

app.use('/api/validate', validator);
app.use('/api/clients', clientsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/salesproducts', salesProductsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/paymentsform', paymentsFormRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Ocurrió un Error en el Tamaño de la Solicitud' });
    }
    next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});