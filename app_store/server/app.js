require('dotenv').config({ path: './server/.env' }); 
require('./db/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const supplierRoutes = require("./routers/supplierRoutes");
const productRoutes = require('./routers/productRoutes');
const orderRoutes = require('./routers/orderRoutes');
const adminRoutes = require("./routers/adminRoutes");

const app = express();

// CORS setup
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }));

app.use(bodyParser.json());

// Routes
app.use("/api/suppliers", supplierRoutes);
app.use('/api/products', productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
