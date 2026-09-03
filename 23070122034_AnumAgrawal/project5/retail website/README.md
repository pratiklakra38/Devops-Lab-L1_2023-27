# Enterprise Retail Management System

A comprehensive, enterprise-grade Retail Management System built with Spring Boot 3, Java 21, and modern DevOps practices.

## 🚀 Technologies Used
- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, Spring Security (JWT)
- **Database:** MySQL 8.x
- **Frontend:** Thymeleaf, Bootstrap 5, Chart.js
- **Containerization:** Docker, Docker Compose (Multi-stage builds)
- **DevSecOps:** Jenkins, GitHub Actions, Docker Scout, Trivy

## 📦 Modules Included
1. **Home Dashboard:** High-level metrics, revenue charts, recent activity.
2. **Product Management:** Full CRUD operations, stock tracking, and SKU management.
3. **Inventory Management:** Warehouse locations, stock quantity tracking, and low-stock alerts.
4. **Order Management:** Order lifecycle tracking, status management, and customer association.
5. **Customer Management:** Customer profiles, contact details, and loyalty points.
6. **Authentication & Security:** Role-Based Access Control, JWT generation/validation, custom user details.

## 🛠️ How to Run Locally

### Using Docker Compose (Recommended)
This is the easiest way to run the full stack, including the MySQL database.
```bash
# Build and start the containers in detached mode
docker-compose up -d --build

# To view logs
docker-compose logs -f

# To stop the system
docker-compose down
```

### Manual Setup (Without Docker)
1. Ensure MySQL is running on port `3306`.
2. Create a database named `retail_db`.
3. Set environment variables or update `application.yml` with your DB credentials.
4. Run the Maven wrapper:
```bash
./mvnw spring-boot:run
```

## 🔐 Default Admin Account
When running the application, you can create a user through the Registration page. By default, newly registered users in this development build will be granted the `ROLE_ADMIN` authority to allow full access to the dashboard.

## 📁 Project Structure
- `src/main/java/com/retail/system/`: Java source code (Controllers, Services, Repos, Entities, Security configuration).
- `src/main/resources/templates/`: Thymeleaf HTML templates.
- `src/main/resources/static/css/`: Custom styles (Bootstrap overrides, Sidebar, etc.).
- `Dockerfile`: Multi-stage Docker build file ensuring an optimized, small footprint image.
- `docker-compose.yml`: Container orchestration configuration.
- `Jenkinsfile` / `.github/workflows/ci.yml`: CI/CD pipelines including Trivy security scanning.

## 🛡️ Security Best Practices Implemented
See `DEPLOYMENT_AND_SECURITY.md` for full DevSecOps deployment and security scanning practices.
