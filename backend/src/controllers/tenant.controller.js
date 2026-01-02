const pool = require("../config/db");

exports.createTenant = async (req, res, next) => {
  try {
    const { name, subdomain } = req.body;

    if (!name || !subdomain) {
      return res.status(400).json({
        error: "Tenant name and subdomain are required",
      });
    }

    const userId = req.user.userId;

    // create tenant
    const tenantResult = await pool.query(
      `
      INSERT INTO tenants (name, subdomain)
      VALUES ($1, $2)
      RETURNING id, name, subdomain
      `,
      [name, subdomain]
    );

    const tenant = tenantResult.rows[0];

    // attach tenant to user
    await pool.query(
      `
      UPDATE users
      SET tenant_id = $1, role = 'super_admin'
      WHERE id = $2
      `,
      [tenant.id, userId]
    );

    res.status(201).json({
      success: true,
      tenant,
    });
  } catch (err) {
    next(err);
  }
};
