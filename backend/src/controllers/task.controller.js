const pool = require("../config/db");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, project_id } = req.body;

    if (!title || !project_id) {
      return res.status(400).json({
        error: "Task title and project_id are required",
      });
    }

    const taskResult = await pool.query(
      `
      INSERT INTO tasks (title, description, project_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, description
      `,
      [title, description || null, project_id]
    );

    res.status(201).json({
      success: true,
      task: taskResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
};
