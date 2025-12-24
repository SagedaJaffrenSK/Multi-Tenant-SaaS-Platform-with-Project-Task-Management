# Research Document – Multi-Tenant SaaS Platform

## 1. Multi-Tenancy Analysis

Multi-tenancy is a core architectural concept in Software as a Service (SaaS) systems where a single application instance serves multiple organizations, referred to as tenants. Each tenant operates as if they have their own isolated system, even though the underlying infrastructure is shared. The primary challenge in multi-tenant systems is ensuring strict data isolation, security, and performance while keeping operational costs low.

Choosing the correct multi-tenancy model is critical because it impacts scalability, security, maintenance effort, and cost. There are three commonly used multi-tenancy approaches in modern SaaS platforms.

### 1.1 Shared Database with Shared Schema

In this approach, all tenants share the same database and the same set of tables. Tenant data is differentiated using a `tenant_id` column in every table. Each database query must explicitly filter data based on the tenant identifier.

**Pros:**
- Lowest infrastructure and maintenance cost
- Simple deployment and scaling
- Efficient use of database resources
- Easy onboarding of new tenants

**Cons:**
- Risk of cross-tenant data leakage if tenant filtering is missed
- Requires strict discipline in query writing
- Complex debugging in case of data access issues

This approach is widely adopted by early-stage and mid-scale SaaS applications because of its cost efficiency and scalability. However, strong application-level enforcement is required to ensure tenant isolation.

### 1.2 Shared Database with Separate Schema

In this model, a single database is shared, but each tenant has its own schema. Each schema contains its own set of tables, providing logical separation between tenants.

**Pros:**
- Better data isolation compared to shared schema
- Easier tenant-level backups and restores
- Reduced risk of accidental data exposure

**Cons:**
- Schema migration complexity
- Increased operational overhead
- Limited scalability for large numbers of tenants

This approach is suitable for SaaS platforms that require stronger isolation but still want to share infrastructure costs.

### 1.3 Separate Database per Tenant

In this approach, each tenant is provided with a completely separate database. This ensures physical isolation of tenant data.

**Pros:**
- Maximum data isolation and security
- Simplified compliance with regulations
- Independent scaling and backups

**Cons:**
- High infrastructure and operational cost
- Complex deployment and monitoring
- Difficult to manage at scale

This approach is typically used by enterprise-grade SaaS platforms serving high-value customers with strict compliance requirements.

### 1.4 Chosen Approach

**Chosen Strategy: Shared Database with Shared Schema (tenant_id based)**

This project adopts the shared database with shared schema approach. The decision is based on cost efficiency, simplicity, and suitability for a student-level multi-tenant SaaS application. With proper middleware enforcement, role-based access control, and strict tenant-based filtering, this approach provides an optimal balance between scalability and security.

---

## 2. Technology Stack Justification

### Backend Framework
Node.js with Express is chosen as the backend framework due to its non-blocking, event-driven architecture, which efficiently handles multiple concurrent requests from different tenants. Express provides a lightweight and flexible framework for building RESTful APIs.

**Alternatives Considered:** Django, Spring Boot  
These alternatives were not chosen due to heavier frameworks and slower development cycles for this project.

### Frontend Framework
React is selected for its component-based architecture, reusability, and strong ecosystem support. React enables efficient state management and seamless integration with backend APIs.

**Alternatives Considered:** Angular, Vue.js  
React was preferred due to its flexibility and widespread industry adoption.

### Database
PostgreSQL is chosen because it supports ACID transactions, strong relational integrity, and scalability. It is well-suited for multi-tenant systems and supports indexing and JSON-based data storage.

**Alternatives Considered:** MySQL, MongoDB

### Authentication Method
JWT (JSON Web Tokens) are used for authentication as they are stateless, scalable, and suitable for distributed systems. JWTs simplify authentication across microservices.

### Deployment Platform
Docker is used for containerization to ensure consistency across development, testing, and production environments.

---

## 3. Security Considerations

### Tenant Data Isolation
Tenant isolation is enforced using a `tenant_id` column in all database tables. Middleware ensures that every request is scoped to the authenticated tenant.

### Authentication and Authorization
JWT-based authentication combined with role-based access control ensures that users can only access authorized resources.

### Password Hashing
Passwords are hashed using bcrypt with salting to protect against brute-force and rainbow table attacks.

### API Security
Rate limiting, input validation, and HTTPS are enforced to protect APIs from abuse and injection attacks.

### Infrastructure Security
Sensitive configuration values are stored in environment variables, and database access follows the principle of least privilege.

---

**Conclusion:**  
By adopting a well-balanced architecture and implementing strong security measures, this multi-tenant SaaS platform ensures scalability, security, and maintainability.
