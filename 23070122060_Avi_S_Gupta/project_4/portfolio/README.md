# Portfolio Project

A complete, production-ready software engineer portfolio application built with Spring Boot.

**Author:** Avi S Gupta (PRN 23070122060)

In DevOps Lab Project 4 this application serves as the Maven project that the distributed
Jenkins pipeline compiles, tests, packages and archives — see [`../README.md`](../README.md).

## Tech Stack
- **Backend**: Java 21, Spring Boot 3.2.3, Spring Data JPA, Hibernate, H2 (local) / MySQL 8 (Docker), Maven
- **Frontend**: Thymeleaf, HTML5, CSS3, Bootstrap 5, JavaScript, AOS Animation Library
- **DevOps**: Docker, Jenkins, JUnit 5

## Features
- Fully responsive modern UI with a premium dark theme and glassmorphism.
- Clean MVC architecture with DTO and Repository patterns.
- Secure Admin Panel (Spring Security) for managing projects, skills, and contact messages.
- Dockerized setup with Jenkins CI pipeline included.

## Getting Started

### Prerequisites
- JDK 21 (the build fails on JDK 24 — Lombok 1.18.30 does not support it)
- Maven 3.9+
- Docker (only for the Compose setup below)

### Running Locally
The application uses an in-memory H2 database, so no database server is needed.

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
mvn spring-boot:run
```

1. Site: `http://localhost:8080`
2. Admin panel: `http://localhost:8080/admin` — log in as `admin` / `admin123`.
   The account is created on first startup by the `CommandLineRunner` in
   `PortfolioApplication.java`; no manual SQL insert is required.

Data is in memory, so any projects, skills or messages added through the admin
panel are lost when the application stops.

### Running the Tests
```bash
mvn test
```
9 tests: 1 context-load test and 8 service tests.

### Running with Docker
```bash
docker-compose up -d
```
Starts MySQL 8 alongside the application and serves it on `http://localhost:8081`.
The datasource URL is supplied by Compose as an environment variable; the driver
and Hibernate dialect are inferred from it, so the same build runs on either
database.
