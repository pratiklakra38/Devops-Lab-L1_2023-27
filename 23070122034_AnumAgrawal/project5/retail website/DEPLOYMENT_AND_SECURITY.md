# Deployment & Security Guide

This document outlines the deployment steps and security best practices implemented in the Enterprise Retail Management System.

## 🚀 Deployment Steps

### 1. Preparing for Production
Before deploying to production, ensure the following steps are taken:
- Change the `spring.jpa.hibernate.ddl-auto` setting in `application.yml` from `update` to `validate` or `none` and use a migration tool like Flyway or Liquibase.
- Update the `jwt.secret` in `application.yml` with a strong, securely generated string. Do NOT use the default secret.
- Ensure `DB_PASSWORD` and other sensitive environment variables are managed via a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) and not hardcoded.

### 2. Docker Deployment
The application uses a highly optimized multi-stage Dockerfile.

**Build Image:**
```bash
docker build -t retail-management-system:latest .
```

**Run via Compose:**
The `docker-compose.yml` file is configured to set up a private bridge network (`retail-network`). Only the web application exposes port `8080` to the host. The MySQL database port `3306` is isolated within the Docker network.

```bash
docker-compose -f docker-compose.yml up -d
```

## 🛡️ Security Best Practices Implemented

### 1. Non-Root Docker User
The Dockerfile configures the application to run as a non-root user (`spring`), adhering to the principle of least privilege. This mitigates the risk of container breakout vulnerabilities.

```dockerfile
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring
```

### 2. DevSecOps Scanning (Trivy & Docker Scout)
We have integrated security scanning directly into our CI/CD pipelines (`Jenkinsfile` and GitHub Actions).

**Trivy (Filesystem & Image Scanning):**
Trivy is used to scan the project files (for exposed secrets and vulnerable dependencies) and the compiled Docker image.
```bash
# Scan local filesystem
trivy fs --severity HIGH,CRITICAL .

# Scan Docker image
trivy image --severity HIGH,CRITICAL retail-management-system:latest
```

**Docker Scout:**
Docker Scout analyzes image layers for CVEs (Common Vulnerabilities and Exposures).
```bash
docker scout cves retail-management-system:latest
```

### 3. Application Security
- **Spring Security 6:** Used to enforce Role-Based Access Control (RBAC).
- **JWT (JSON Web Tokens):** Stateless authentication implemented via filters, ensuring that session cookies are not vulnerable to CSRF attacks for API endpoints.
- **Password Hashing:** Passwords are never stored in plain text. `BCryptPasswordEncoder` is utilized to securely hash passwords.
- **Prepared Statements:** Spring Data JPA / Hibernate automatically uses prepared statements, mitigating SQL injection risks.
