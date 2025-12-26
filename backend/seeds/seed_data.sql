-- Super Admin
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
  gen_random_uuid(),
  'superadmin@system.com',
  '$2b$10$wHq3YF6bqv5cWZ6ZqH5H9eH4hV2mVJ5kJ1z4n7cP6pQq7XQ6X8O2y',
  'System Admin',
  'super_admin'
);

-- Tenant
INSERT INTO tenants (id, name, subdomain, status, subscription_plan)
VALUES (
  gen_random_uuid(),
  'Demo Company',
  'demo',
  'active',
  'pro'
);

-- Tenant Admin
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT
  gen_random_uuid(),
  t.id,
  'admin@demo.com',
  '$2b$10$wHq3YF6bqv5cWZ6ZqH5H9eH4hV2mVJ5kJ1z4n7cP6pQq7XQ6X8O2y',
  'Demo Admin',
  'tenant_admin'
FROM tenants t WHERE subdomain='demo';
