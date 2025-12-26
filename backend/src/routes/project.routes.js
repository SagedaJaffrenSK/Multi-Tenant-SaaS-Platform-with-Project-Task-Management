const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createProject,
  listProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

// API 12 & 13
router.post("/", auth, createProject);
router.get("/", auth, listProjects);

// API 14 & 15
router.put("/:projectId", auth, updateProject);
router.delete("/:projectId", auth, deleteProject);

module.exports = router;
