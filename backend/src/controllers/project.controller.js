const pool = require("../config/db");

/**
 * API 12: Create Project
 */
exports.createProject = async (req, res, next) => {
  const { name, description, status = "active" } = req.body;
  const { tenantId, userId } = req.user;

  try {
    // Check project limit
    const limitResult = await pool.query(
      `SELECT max_projects,
              (SELECT COUNT(*) FROM projects WHERE tenant_id = $1) AS total_projects
       FROM tenants WHERE id = $1`,
      [tenantId]
    );

    const { max_projects, total_projects } = limitResult.rows[0];

    if (Number(total_projects) >= max_projects) {
      return res.status(403).json({ message: "Project limit reached" });
    }

    const result = await pool.query(
      `INSERT INTO projects (tenant_id, name, description, status, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, tenant_id, name, description, status, created_by, created_at`,
      [tenantId, name, description, status, userId]
    );

    const p = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: p.id,
        tenantId: p.tenant_id,
        name: p.name,
        description: p.description,
        status: p.status,
        createdBy: p.created_by,
        createdAt: p.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 13: List Projects
 */
exports.listProjects = async (req, res, next) => {
  const { tenantId } = req.user;
  const { status, search, page = 1, limit = 20 } = req.query;

  const offset = (page - 1) * limit;

  try {
    let where = [`p.tenant_id = $1`];
    let values = [tenantId];
    let idx = 2;

    if (status) {
      where.push(`p.status = $${idx++}`);
      values.push(status);
    }

    if (search) {
      where.push(`p.name ILIKE $${idx++}`);
      values.push(`%${search}%`);
    }

    const projectsResult = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.status,
        p.created_at,
        u.id AS creator_id,
        u.full_name AS creator_name,
        COUNT(t.id) AS task_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed_task_count
      FROM projects p
      JOIN users u ON p.created_by = u.id
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE ${where.join(" AND ")}
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT $${idx++} OFFSET $${idx}
      `,
      [...values, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM projects WHERE tenant_id = $1`,
      [tenantId]
    );

    const total = Number(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        projects: projectsResult.rows.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          createdBy: {
            id: p.creator_id,
            fullName: p.creator_name,
          },
          taskCount: Number(p.task_count),
          completedTaskCount: Number(p.completed_task_count),
          createdAt: p.created_at,
        })),
        total,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          limit: Number(limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 14: Update Project
 */
exports.updateProject = async (req, res, next) => {
  const { projectId } = req.params;
  const { tenantId, userId, role } = req.user;
  const { name, description, status } = req.body;

  try {
    const projectResult = await pool.query(
      `SELECT id, created_by FROM projects
       WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (!projectResult.rows.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = projectResult.rows[0];

    if (role !== "tenant_admin" && project.created_by !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (description) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }
    if (status) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }

    fields.push(`updated_at = NOW()`);

    const result = await pool.query(
      `UPDATE projects
       SET ${fields.join(", ")}
       WHERE id = $${idx}
       RETURNING id, name, description, status, updated_at`,
      [...values, projectId]
    );

    res.json({
      success: true,
      message: "Project updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 15: Delete Project
 */
exports.deleteProject = async (req, res, next) => {
  const { projectId } = req.params;
  const { tenantId, userId, role } = req.user;

  try {
    const projectResult = await pool.query(
      `SELECT id, created_by FROM projects
       WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (!projectResult.rows.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = projectResult.rows[0];

    if (role !== "tenant_admin" && project.created_by !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pool.query(`DELETE FROM projects WHERE id = $1`, [projectId]);

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
