const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/register-tenant", authController.registerTenant);
router.post("/login", authController.loginUser);
router.get("/me", authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;
