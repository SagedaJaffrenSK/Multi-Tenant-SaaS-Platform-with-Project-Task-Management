const pool = require("../config/db");

/**
 * API 5: Get Tenant Details
 */
exports.getTenantDetails = async (req, res, next) => {
  const { tenantId } = req.params;
  const { tenantId: userTenantId, role } = req.user;

  try {
    // Authorization
    if (role !== "super_admin" && userTenantId !== tenantId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const tenantResult = await pool.query(
      `SELECT id, name, subdomain, status, subscription_plan,
              max_users, max_projects, created_at
       FROM tenants
       WHERE id = $1`,
      [tenantId]
    );

    if (!tenantResult.rows.length) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const statsResult = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE tenant_id = $1) AS total_users,
         (SELECT COUNT(*) FROM projects WHERE tenant_id = $1) AS total_projects,
         (SELECT COUNT(*) FROM tasks WHERE tenant_id = $1) AS total_tasks`,
      [tenantId]
    );

    const tenant = tenantResult.rows[0];
    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        subscriptionPlan: tenant.subscription_plan,
        maxUsers: tenant.max_users,
        maxProjects: tenant.max_projects,
        createdAt: tenant.created_at,
        stats: {
          totalUsers: Number(stats.total_users),
          totalProjects: Number(stats.total_projects),
          totalTasks: Number(stats.total_tasks),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 6: Update Tenant
 */
exports.updateTenant = async (req, res, next) => {
  const { tenantId } = req.params;
  const { role } = req.user;
  const {
    name,
    status,
    subscriptionPlan,
    maxUsers,
    maxProjects,
  } = req.body;

  try {
    // Tenant admin restrictions
    if (role === "tenant_admin") {
      if (status || subscriptionPlan || maxUsers || maxProjects) {
        return res.status(403).json({
          message: "Tenant admin cannot update restricted fields",
        });
      }
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (role === "super_admin") {
      if (status) {
        fields.push(`status = $${idx++}`);
        values.push(status);
      }
      if (subscriptionPlan) {
        fields.push(`subscription_plan = $${idx++}`);
        values.push(subscriptionPlan);
      }
      if (maxUsers) {
        fields.push(`max_users = $${idx++}`);
        values.push(maxUsers);
      }
      if (maxProjects) {
        fields.push(`max_projects = $${idx++}`);
        values.push(maxProjects);
      }
    }

    fields.push(`updated_at = NOW()`);

    const result = await pool.query(
      `UPDATE tenants
       SET ${fields.join(", ")}
       WHERE id = $${idx}
       RETURNING id, name, updated_at`,
      [...values, tenantId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.json({
      success: true,
      message: "Tenant updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 7: List All Tenants (Super Admin only)
 */
exports.listTenants = async (req, res, next) => {
  const { page = 1, limit = 10, status, subscriptionPlan } = req.query;

  const offset = (page - 1) * limit;

  try {
    let where = [];
    let values = [];
    let idx = 1;

    if (status) {
      where.push(`status = $${idx++}`);
      values.push(status);
    }
    if (subscriptionPlan) {
      where.push(`subscription_plan = $${idx++}`);
      values.push(subscriptionPlan);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const tenantsResult = await pool.query(
      `
      SELECT t.id, t.name, t.subdomain, t.status, t.subscription_plan,
             t.created_at,
             COUNT(DISTINCT u.id) AS total_users,
             COUNT(DISTINCT p.id) AS total_projects
      FROM tenants t
      LEFT JOIN users u ON u.tenant_id = t.id
      LEFT JOIN projects p ON p.tenant_id = t.id
      ${whereClause}
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT $${idx++} OFFSET $${idx}
      `,
      [...values, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tenants ${whereClause}`,
      values
    );

    const totalTenants = Number(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        tenants: tenantsResult.rows.map(t => ({
          id: t.id,
          name: t.name,
          subdomain: t.subdomain,
          status: t.status,
          subscriptionPlan: t.subscription_plan,
          totalUsers: Number(t.total_users),
          totalProjects: Number(t.total_projects),
          createdAt: t.created_at,
        })),
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalTenants / limit),
          totalTenants,
          limit: Number(limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
