const pool = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * API 8: Add User to Tenant
 */
exports.addUser = async (req, res, next) => {
  const { tenantId } = req.params;
  const { email, password, fullName, role = "user" } = req.body;
  const { tenantId: adminTenantId } = req.user;

  try {
    // Ensure tenant_admin is adding to own tenant
    if (tenantId !== adminTenantId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check subscription user limit
    const limitResult = await pool.query(
      `SELECT max_users,
              (SELECT COUNT(*) FROM users WHERE tenant_id = $1) AS total_users
       FROM tenants WHERE id = $1`,
      [tenantId]
    );

    if (!limitResult.rows.length) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { max_users, total_users } = limitResult.rows[0];
    if (Number(total_users) >= max_users) {
      return res.status(403).json({ message: "User limit reached" });
    }

    // Check email uniqueness per tenant
    const exists = await pool.query(
      `SELECT id FROM users WHERE tenant_id = $1 AND email = $2`,
      [tenantId, email]
    );

    if (exists.rows.length) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, tenant_id, is_active, created_at`,
      [tenantId, email, hashed, fullName, role]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        fullName: result.rows[0].full_name,
        role: result.rows[0].role,
        tenantId: result.rows[0].tenant_id,
        isActive: result.rows[0].is_active,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 9: List Tenant Users
 */
exports.listUsers = async (req, res, next) => {
  const { tenantId } = req.params;
  const { tenantId: userTenantId } = req.user;
  const { search, role, page = 1, limit = 50 } = req.query;

  if (tenantId !== userTenantId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const offset = (page - 1) * limit;

  try {
    let where = [`tenant_id = $1`];
    let values = [tenantId];
    let idx = 2;

    if (search) {
      where.push(`(email ILIKE $${idx} OR full_name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    if (role) {
      where.push(`role = $${idx++}`);
      values.push(role);
    }

    const usersResult = await pool.query(
      `
      SELECT id, email, full_name, role, is_active, created_at
      FROM users
      WHERE ${where.join(" AND ")}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx}
      `,
      [...values, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users WHERE ${where.join(" AND ")}`,
      values
    );

    const total = Number(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        users: usersResult.rows.map(u => ({
          id: u.id,
          email: u.email,
          fullName: u.full_name,
          role: u.role,
          isActive: u.is_active,
          createdAt: u.created_at,
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
 * API 10: Update User
 */
exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { userId: requesterId, role, tenantId } = req.user;
  const { fullName, role: newRole, isActive } = req.body;

  try {
    const userResult = await pool.query(
      `SELECT id, tenant_id FROM users WHERE id = $1`,
      [userId]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userResult.rows[0].tenant_id !== tenantId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Self update only allowed for fullName
    if (requesterId === userId && (newRole || isActive !== undefined)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Only tenant_admin can change role or isActive
    if (role !== "tenant_admin" && (newRole || isActive !== undefined)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (fullName) {
      fields.push(`full_name = $${idx++}`);
      values.push(fullName);
    }
    if (newRole) {
      fields.push(`role = $${idx++}`);
      values.push(newRole);
    }
    if (isActive !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(isActive);
    }

    fields.push(`updated_at = NOW()`);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")}
       WHERE id = $${idx}
       RETURNING id, full_name, role, updated_at`,
      [...values, userId]
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 11: Delete User
 */
exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const { userId: adminId, tenantId } = req.user;

  if (userId === adminId) {
    return res.status(403).json({ message: "Cannot delete self" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1 AND tenant_id = $2
       RETURNING id`,
      [userId, tenantId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
