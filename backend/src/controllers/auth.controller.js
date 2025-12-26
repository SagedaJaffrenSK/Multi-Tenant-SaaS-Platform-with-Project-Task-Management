const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.registerTenant = async (req, res, next) => {
  const {
    tenantName,
    subdomain,
    adminEmail,
    adminPassword,
    adminFullName,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check subdomain
    const existingTenant = await client.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (existingTenant.rows.length) {
      return res.status(409).json({ message: "Subdomain already exists" });
    }

    // Create tenant
    const tenantResult = await client.query(
      `INSERT INTO tenants (name, subdomain, subscription_plan, max_users, max_projects)
       VALUES ($1, $2, 'free', 5, 3)
       RETURNING id`,
      [tenantName, subdomain]
    );

    const tenantId = tenantResult.rows[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const userResult = await client.query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, 'tenant_admin')
       RETURNING id, email, full_name, role`,
      [tenantId, adminEmail, hashedPassword, adminFullName]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: {
        tenantId,
        subdomain,
        adminUser: userResult.rows[0],
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res, next) => {
  const { email, password, tenantSubdomain } = req.body;

  try {
    const tenantResult = await pool.query(
      "SELECT id, status FROM tenants WHERE subdomain = $1",
      [tenantSubdomain]
    );

    if (!tenantResult.rows.length) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenant = tenantResult.rows[0];

    if (tenant.status !== "active") {
      return res.status(403).json({ message: "Tenant inactive" });
    }

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND tenant_id = $2`,
      [email, tenant.id]
    );

    if (!userResult.rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: tenant.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: tenant.id,
        },
        token,
        expiresIn: 86400,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.role, u.is_active,
              t.id AS tenant_id, t.name, t.subdomain, t.subscription_plan,
              t.max_users, t.max_projects
       FROM users u
       JOIN tenants t ON u.tenant_id = t.id
       WHERE u.id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const u = result.rows[0];

    res.json({
      success: true,
      data: {
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        role: u.role,
        isActive: u.is_active,
        tenant: {
          id: u.tenant_id,
          name: u.name,
          subdomain: u.subdomain,
          subscriptionPlan: u.subscription_plan,
          maxUsers: u.max_users,
          maxProjects: u.max_projects,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
