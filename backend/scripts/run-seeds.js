const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

async function runSeeds() {
  const seedFile = path.join(__dirname, "../seeds/seed.sql");
  const sql = fs.readFileSync(seedFile, "utf8");

  await pool.query(sql);
  console.log("✅ Seed data loaded");
}

runSeeds()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  });
