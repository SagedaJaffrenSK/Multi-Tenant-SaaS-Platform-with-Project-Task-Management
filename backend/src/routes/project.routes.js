const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * CREATE PROJECT
 * POST /api/projects
 */
router.post(
  "/",
  authMiddleware,
  projectController.createProject
);

module.exports = router;
