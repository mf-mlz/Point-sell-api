const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const clientsRoutes = require('./modules/clients/routes/clientRoutes');
const employeesRoutes = require('./modules/employees/routes/employeesRoutes');
const productsRoutes = require('./modules/products/routes/productsRoutes');
const salesRoutes = require('./modules/sales/routes/salesRoutes');
const salesProductsRoutes = require('./modules/salesProducts/routes/salesProductsRoutes');
const invoicesRoutes = require('./modules/invoices/routes/invoicesRoutes');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

app.use('/api/clients', clientsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/salesproducts', salesProductsRoutes);
app.use('/api/invoices', invoicesRoutes);

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