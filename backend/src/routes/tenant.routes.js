const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
  getTenantDetails,
  updateTenant,
  listTenants,
} = require("../controllers/tenant.controller");

/**
 * API 5: Get Tenant Details
 */
router.get("/:tenantId", auth, getTenantDetails);

/**
 * API 6: Update Tenant (tenant_admin or super_admin)
 */
router.put(
  "/:tenantId",
  auth,
  roleMiddleware("tenant_admin"),
  updateTenant
);

/**
 * API 7: List All Tenants (super_admin only)
 */
router.get("/", auth, roleMiddleware("super_admin"), listTenants);

module.exports = router;
