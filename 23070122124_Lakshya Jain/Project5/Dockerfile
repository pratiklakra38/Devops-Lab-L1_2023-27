# ==========================================
# Production-ready lightweight Dockerfile
# Base Image: Eclipse Temurin JRE 17 (Alpine Linux)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

# Set working directory inside container
WORKDIR /app

# Copy the pre-built Spring Boot executable JAR from target directory
COPY target/retail-product-api.jar app.jar

# Expose default application port
EXPOSE 8080

# Configure JVM execution parameters and start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
