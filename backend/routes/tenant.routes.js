const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');

// Line 7: Verify tenantController.getAllTenants is defined
router.get('/', tenantController.getAllTenants);
router.post('/register-tenant', tenantController.registerTenant);

module.exports = router;