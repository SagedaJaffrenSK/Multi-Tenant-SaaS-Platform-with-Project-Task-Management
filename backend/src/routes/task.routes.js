const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createTask,
  listTasks,
  updateTaskStatus,
  updateTask,
} = require("../controllers/task.controller");

// API 16 & 17
router.post("/projects/:projectId/tasks", auth, createTask);
router.get("/projects/:projectId/tasks", auth, listTasks);

// API 18 & 19
router.patch("/tasks/:taskId/status", auth, updateTaskStatus);
router.put("/tasks/:taskId", auth, updateTask);

module.exports = router;
