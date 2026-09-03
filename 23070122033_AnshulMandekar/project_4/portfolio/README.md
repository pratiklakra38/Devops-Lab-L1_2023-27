# Portfolio Project

This is a complete, production-ready software engineer portfolio built for Anshul Ravindra Mandekar.

## Tech Stack
- **Backend**: Java 21, Spring Boot 3.x, Spring Data JPA, Hibernate, MySQL, Maven
- **Frontend**: Thymeleaf, HTML5, CSS3, Bootstrap 5, JavaScript, AOS Animation Library
- **DevOps**: Docker, Jenkins, JUnit 5

## Features
- Fully responsive modern UI with a premium dark theme and glassmorphism.
- Clean MVC architecture with DTO and Repository patterns.
- Secure Admin Panel (Spring Security) for managing projects, skills, and contact messages.
- Dockerized setup with Jenkins CI pipeline included.

## Getting Started

### Prerequisites
- JDK 21
- Maven
- MySQL 8
- Docker (optional)

### Running Locally
1. Start MySQL and create a database named `portfolio_db`.
2. Update the credentials in `src/main/resources/application.properties` if needed.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Access the site at `http://localhost:8080`.
5. Access Admin panel at `http://localhost:8080/admin` (default user: `admin`/`admin123` - you will need to insert this user into the DB or configure in memory for first setup).

### Running with Docker
```bash
docker-compose up -d
```
