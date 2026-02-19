const pool = require('../config/db'); // Assuming you have a DB config

const getAllTenants = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tenants');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerTenant = async (req, res) => {
    const { name, slug, email, password, full_name } = req.body;
    // Logic for creating tenant and admin user...
    res.status(201).json({ message: "Tenant registered successfully" });
};

// CRITICAL: Ensure these match the names used in tenant.routes.js
module.exports = {
    getAllTenants,
    registerTenant
};