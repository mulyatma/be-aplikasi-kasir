const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const authRoutes = require('./app/routes/authRoutes');
const menuRoutes = require('./app/routes/menuRoutes');
const transactionRoutes = require('./app/routes/transactionRoutes');
const reportRoutes = require('./app/routes/reportRoutes');
const employeeRoutes = require('./app/routes/employeeRoutes');
const stockRoutes = require('./app/routes/stockRoutes');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.send('API Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/stocks', stockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
