const express = require('express');
const dotenv = require('dotenv');
const clientsRoutes = require('./modules/clients/routes/clientRoutes');
const employeesRoutes = require('./modules/employees/routes/employeesRoutes');
const productsRoutes = require('./modules/products/routes/productsRoutes');
const salesRoutes = require('./modules/sales/routes/salesRoutes');
const salesProductsRoutes = require('./modules/salesProducts/routes/salesProductsRoutes');
const invoicesRoutes = require('./modules/invoices/routes/invoicesRoutes');
const paymentsFormRoutes = require('./modules/paymentsForm/routes/paymentsFormRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/clients', clientsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/salesproducts', salesProductsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/paymentsform', paymentsFormRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});