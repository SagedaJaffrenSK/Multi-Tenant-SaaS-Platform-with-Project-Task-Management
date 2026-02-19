require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tenantRoutes = require('./routes/tenant.routes');

const authRoutes = require('./routes/auth.routes'); 
app.use('/api/auth', authRoutes); // This must match the frontend URL
const app = express();
app.use(cors({
    origin: "http://localhost:3000", // Allow your frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());

// Health Check for Evaluator
app.get('/api/health', (req, res) => res.status(200).send('OK'));

// Routes
app.use('/api/tenants', tenantRoutes);

const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0'; 

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on ${PORT}`);
});