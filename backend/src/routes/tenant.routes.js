const express = require("express");
const router = express.Router();

const tenantController = require("../controllers/tenant.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * CREATE TENANT
 * POST /api/tenants
 */
router.post(
  "/",
  authMiddleware,
  tenantController.createTenant
);

module.exports = router;
