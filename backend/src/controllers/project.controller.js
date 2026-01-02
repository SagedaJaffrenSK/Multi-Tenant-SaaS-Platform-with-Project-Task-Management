const pool = require("../config/db");

exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const userId = req.user.userId;

    // find tenant of logged-in user
    const userResult = await pool.query(
      "SELECT tenant_id FROM users WHERE id = $1",
      [userId]
    );

    const tenantId = userResult.rows[0]?.tenant_id;

    if (!tenantId) {
      return res.status(400).json({
        error: "User is not associated with any tenant",
      });
    }

    // create project
    const projectResult = await pool.query(
      `
      INSERT INTO projects (name, description, tenant_id, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description
      `,
      [name, description || null, tenantId, userId]
    );

    res.status(201).json({
      success: true,
      project: projectResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
};
