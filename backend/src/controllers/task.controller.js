const pool = require("../config/db");

/**
 * API 16: Create Task
 */
exports.createTask = async (req, res, next) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, priority = "medium", dueDate } = req.body;
  const { tenantId } = req.user;

  try {
    // Verify project belongs to tenant
    const projectResult = await pool.query(
      `SELECT tenant_id FROM projects WHERE id = $1`,
      [projectId]
    );

    if (!projectResult.rows.length || projectResult.rows[0].tenant_id !== tenantId) {
      return res.status(403).json({ message: "Project does not belong to tenant" });
    }

    // Validate assigned user (if provided)
    if (assignedTo) {
      const userResult = await pool.query(
        `SELECT id FROM users WHERE id = $1 AND tenant_id = $2`,
        [assignedTo, tenantId]
      );

      if (!userResult.rows.length) {
        return res.status(400).json({ message: "Assigned user not in tenant" });
      }
    }

    const result = await pool.query(
      `INSERT INTO tasks
       (project_id, tenant_id, title, description, status, priority, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, 'todo', $5, $6, $7)
       RETURNING *`,
      [projectId, tenantId, title, description, priority, assignedTo || null, dueDate || null]
    );

    const t = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: t.id,
        projectId: t.project_id,
        tenantId: t.tenant_id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignedTo: t.assigned_to,
        dueDate: t.due_date,
        createdAt: t.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 17: List Project Tasks
 */
exports.listTasks = async (req, res, next) => {
  const { projectId } = req.params;
  const { tenantId } = req.user;
  const { status, assignedTo, priority, search, page = 1, limit = 50 } = req.query;

  const offset = (page - 1) * limit;

  try {
    // Verify project belongs to tenant
    const projectCheck = await pool.query(
      `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (!projectCheck.rows.length) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let where = [`t.project_id = $1`, `t.tenant_id = $2`];
    let values = [projectId, tenantId];
    let idx = 3;

    if (status) {
      where.push(`t.status = $${idx++}`);
      values.push(status);
    }
    if (assignedTo) {
      where.push(`t.assigned_to = $${idx++}`);
      values.push(assignedTo);
    }
    if (priority) {
      where.push(`t.priority = $${idx++}`);
      values.push(priority);
    }
    if (search) {
      where.push(`t.title ILIKE $${idx++}`);
      values.push(`%${search}%`);
    }

    const tasksResult = await pool.query(
      `
      SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.due_date, t.created_at,
        u.id AS user_id, u.full_name, u.email
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE ${where.join(" AND ")}
      ORDER BY t.priority DESC, t.due_date ASC NULLS LAST
      LIMIT $${idx++} OFFSET $${idx}
      `,
      [...values, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tasks t WHERE ${where.join(" AND ")}`,
      values
    );

    const total = Number(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        tasks: tasksResult.rows.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          assignedTo: t.user_id
            ? { id: t.user_id, fullName: t.full_name, email: t.email }
            : null,
          dueDate: t.due_date,
          createdAt: t.created_at,
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
 * API 18: Update Task Status
 */
exports.updateTaskStatus = async (req, res, next) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET status = $1, updated_at = NOW()
       WHERE id = $2 AND tenant_id = $3
       RETURNING id, status, updated_at`,
      [status, taskId, tenantId]
    );

    if (!result.rows.length) {
      return res.status(403).json({ message: "Task not found or unauthorized" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 19: Update Task (Partial)
 */
exports.updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { tenantId } = req.user;
  const { title, description, status, priority, assignedTo, dueDate } = req.body;

  try {
    // Validate assigned user if provided
    if (assignedTo) {
      const userCheck = await pool.query(
        `SELECT id FROM users WHERE id = $1 AND tenant_id = $2`,
        [assignedTo, tenantId]
      );

      if (!userCheck.rows.length) {
        return res.status(400).json({ message: "Assigned user not in tenant" });
      }
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (title) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (description) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }
    if (status) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (priority) {
      fields.push(`priority = $${idx++}`);
      values.push(priority);
    }
    if (assignedTo !== undefined) {
      fields.push(`assigned_to = $${idx++}`);
      values.push(assignedTo);
    }
    if (dueDate !== undefined) {
      fields.push(`due_date = $${idx++}`);
      values.push(dueDate);
    }

    fields.push(`updated_at = NOW()`);

    const result = await pool.query(
      `UPDATE tasks
       SET ${fields.join(", ")}
       WHERE id = $${idx} AND tenant_id = $${idx + 1}
       RETURNING *`,
      [...values, taskId, tenantId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const t = result.rows[0];

    res.json({
      success: true,
      message: "Task updated successfully",
      data: {
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignedTo: t.assigned_to,
        dueDate: t.due_date,
        updatedAt: t.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
};
