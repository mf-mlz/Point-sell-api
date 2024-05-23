const express = require('express');
const dotenv = require('dotenv');
const clientsRoutes = require('./modules/clients/routes/clientRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/clients', clientsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});