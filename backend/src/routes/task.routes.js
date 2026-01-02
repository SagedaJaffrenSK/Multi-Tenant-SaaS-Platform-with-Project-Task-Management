const express = require("express");
const router = express.Router();

const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * CREATE TASK
 * POST /api/tasks
 */
router.post(
  "/tasks",
  authMiddleware,
  taskController.createTask
);

module.exports = router;
