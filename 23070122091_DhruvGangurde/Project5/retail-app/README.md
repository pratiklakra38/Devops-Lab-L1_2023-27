\# Project 5 – Containerizing Spring Boot Application with Docker



\## Objective



Containerize a Spring Boot retail application using Docker and deploy it as a Docker container.



\## Technologies Used



\* Java 17

\* Spring Boot 4.0.8

\* Maven

\* Docker

\* Docker Desktop



\## Application



The application is a simple Spring Boot retail application that exposes a REST endpoint.



\### Endpoint



```text

GET /

```



Response:



```text

Retail Application is running successfully!

```



\## Dockerfile



The application is packaged into a Docker image using the following Dockerfile:



```dockerfile

FROM eclipse-temurin:17-jre



WORKDIR /app



COPY target/retail-app-0.0.1-SNAPSHOT.jar app.jar



EXPOSE 8082



ENTRYPOINT \["java", "-jar", "app.jar"]

```



> Note: Spring Boot runs on port 8080 inside the container. The Docker host maps port 8082 to container port 8080.



\## Build the Application



```powershell

mvn clean package

```



\## Build the Docker Image



```powershell

docker build -t retail-app:1.0 .

```



\## Run the Docker Container



```powershell

docker run -p 8082:8080 --name retail-container retail-app:1.0

```



Port mapping:



```text

Host:8082 → Container:8080

```



\## Verify the Deployment



The application was successfully tested using:



```powershell

curl.exe http://localhost:8082/

```



Output:



```text

Retail Application is running successfully!

```



\## Verification



The Spring Boot application successfully started inside the Docker container, and the REST endpoint returned HTTP 200 with the expected response.



\## Screenshots



\### 1. Spring Boot Application Running in Docker



\*Add the screenshot showing the Spring Boot/Tomcat startup logs here.\*



\### 2. Docker Application Verification



\*Add the screenshot showing the successful curl response here.\*



\## Result



The Spring Boot retail application was successfully containerized using Docker and deployed successfully. The application was verified through the exposed Docker port and returned the expected response.



