require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ DB CONNECTED AT STARTUP");
  } catch (err) {
    console.error("❌ DB CONNECTION FAILED AT STARTUP");
    console.error(err.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });
})();
