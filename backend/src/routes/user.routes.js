const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  addUser,
  listUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

// API 8 & 9
router.post(
  "/tenants/:tenantId/users",
  auth,
  role("tenant_admin"),
  addUser
);

router.get(
  "/tenants/:tenantId/users",
  auth,
  listUsers
);

// API 10 & 11
router.put("/users/:userId", auth, updateUser);
router.delete(
  "/users/:userId",
  auth,
  role("tenant_admin"),
  deleteUser
);

module.exports = router;
