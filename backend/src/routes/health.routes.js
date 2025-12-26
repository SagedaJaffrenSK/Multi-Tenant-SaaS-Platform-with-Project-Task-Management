const router = require("express").Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error" });
  }
});

module.exports = router;
