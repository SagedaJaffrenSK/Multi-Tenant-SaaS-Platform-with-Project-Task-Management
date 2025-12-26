-- =========================
-- Seed Data for Multi-Tenant SaaS
-- =========================

-- NOTE:
-- Passwords are pre-hashed using bcrypt
-- SuperAdmin password: Admin@123
-- Demo Admin password: Demo@123
-- Demo Users password: User@123

-- =========================
-- 1. Super Admin (No Tenant)
-- =========================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role, is_active
) VALUES (
    uuid_generate_v4(),
    NULL,
    'superadmin@system.com',
    '$2b$10$u1Q9kq9y6Y0p0U1kC0kL9eZ4m0h1p7kq8b3ZrY8kQ0H3mQ2KqZ2dK',
    'System Super Admin',
    'super_admin',
    true
);

-- =========================
-- 2. Demo Tenant
-- =========================
INSERT INTO tenants (
    id, name, subdomain, status, subscription_plan, max_users, max_projects
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Demo Company',
    'demo',
    'active',
    'pro',
    10,
    5
);

-- =========================
-- 3. Tenant Admin for Demo Company
-- =========================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role, is_active
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'admin@demo.com',
    '$2b$10$u1Q9kq9y6Y0p0U1kC0kL9eZ4m0h1p7kq8b3ZrY8kQ0H3mQ2KqZ2dK',
    'Demo Tenant Admin',
    'tenant_admin',
    true
);

-- =========================
-- 4. Regular Users for Demo Company
-- =========================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role, is_active
) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'user1@demo.com',
    '$2b$10$u1Q9kq9y6Y0p0U1kC0kL9eZ4m0h1p7kq8b3ZrY8kQ0H3mQ2KqZ2dK',
    'Demo User One',
    'user',
    true
),
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'user2@demo.com',
    '$2b$10$u1Q9kq9y6Y0p0U1kC0kL9eZ4m0h1p7kq8b3ZrY8kQ0H3mQ2KqZ2dK',
    'Demo User Two',
    'user',
    true
);

-- =========================
-- 5. Demo Projects
-- =========================
INSERT INTO projects (
    id, tenant_id, name, description, status, created_by
) VALUES
(
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Website Redesign',
    'Redesign company website',
    'active',
    '22222222-2222-2222-2222-222222222222'
),
(
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Mobile App',
    'Develop mobile application',
    'active',
    '22222222-2222-2222-2222-222222222222'
);

-- =========================
-- 6. Demo Tasks (5 Tasks)
-- =========================
INSERT INTO tasks (
    id, project_id, tenant_id, title, status, priority, assigned_to
) VALUES
(
    uuid_generate_v4(),
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Design landing page',
    'todo',
    'high',
    '33333333-3333-3333-3333-333333333333'
),
(
    uuid_generate_v4(),
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Update branding',
    'in_progress',
    'medium',
    '44444444-4444-4444-4444-444444444444'
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Create API integration',
    'todo',
    'high',
    '33333333-3333-3333-3333-333333333333'
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Implement authentication',
    'in_progress',
    'high',
    '22222222-2222-2222-2222-222222222222'
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Testing and QA',
    'todo',
    'low',
    '44444444-4444-4444-4444-444444444444'
);
