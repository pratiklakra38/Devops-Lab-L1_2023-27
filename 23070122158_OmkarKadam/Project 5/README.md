# Project 5: Containerizing Application and Scanning Docker Image with DTR

## Objective
Deploy a Spring Boot application on Docker for a retail company with multiple web applications, and scan its Docker image using Docker Trusted Registry (DTR) / Docker Hub.

## Step-by-Step Guide

### Step 1: Create a Spring Boot Application
Initialize a basic Spring Boot app using Spring Initializr (https://start.spring.io) with the `Spring Web` dependency. Extract the zip in this directory.
Compile it into a JAR file:
```bash
./mvnw clean package
```

### Step 2: Create a Dockerfile
Create a `Dockerfile` for the Spring Boot application.

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 3: Build the Docker Image
Build the image with a tag corresponding to your registry (e.g., Docker Hub or an Enterprise DTR).
```bash
docker build -t yourusername/retail-app:v1.0 .
```

### Step 4: Scan the Image for Vulnerabilities
*Note: If you don't have access to an enterprise DTR with built-in scanning, you can use Docker Hub's scanning capabilities, Docker Scout, or Trivy.*

Using Docker Scout (built into newer Docker CLI):
```bash
docker scout cves yourusername/retail-app:v1.0
```
Or using Trivy:
```bash
trivy image yourusername/retail-app:v1.0
```

### Step 5: Push Image to Registry
Push the validated image to your registry.
```bash
docker login
docker push yourusername/retail-app:v1.0
```

### Step 6: Deploy the Application
Run the containerized application.
```bash
docker run -d -p 8080:8080 --name retail-app yourusername/retail-app:v1.0
```
