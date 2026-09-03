# Project 2: Deploy Angular Application in Docker Container

## Student Details

**Name:** Anum Agrawal
**PNR:** 23070122034

**Course:** DevOps Lab 

---

# Project Objective

The objective of this project is to deploy an Angular application using Docker. The application is developed using Angular CLI and containerized using Docker for development. Docker Compose is used to simplify deployment and container management.

---

# Tools & Technologies

- Angular CLI 21
- Docker Desktop
- Docker Compose
- Node.js 22
- VS Code
- Git & GitHub

---

# Project Workflow

```
Create Angular Application
            │
            ▼
Verify Application using ng serve
            │
            ▼
Build Angular Application
            │
            ▼
Create Dockerfile
            │
            ▼
Build Docker Image
            │
            ▼
Run Docker Container
            │
            ▼
Access Application on localhost:4200
```

---

# Step 1 - Create Angular Application

Created a new Angular application using Angular CLI.

### Command

```bash
ng new angular-docker-app --ssr=false
```

---

# Step 2 - Verify the Application

Verified that the application runs correctly using Angular Development Server.

### Command

```bash
ng serve
```

Application URL

```
http://localhost:4200
```

---

# Step 3 - Build the Application

Built the Angular application to generate production-ready files.

### Command

```bash
npm run build
```

Output Directory

```
dist/angular-docker-app
```

---

# Step 4 - Docker Configuration

Created the following files:

- Dockerfile
- docker-compose.yml
- .dockerignore

Dockerfile installs project dependencies, copies the application, exposes port 4200 and starts the Angular development server.

---

# Step 5 - Build Docker Image

### Command

```bash
docker build -t angular-dev .
```

Docker successfully created the image.

---

# Step 6 - Run Docker Container

### Command

```bash
docker run -it -p 4200:4200 angular-dev
```

The Angular application started successfully inside the Docker container.

---

# Step 7 - Docker Compose

Started the application using Docker Compose.

### Command

```bash
docker compose up
```

Docker Compose automatically built the image and created the container.

---

# Project Structure

```
angular-docker-app/
│
├── src/
├── public/
├── package.json
├── angular.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── README.md
└── dist/
```

---

# Docker Commands Used

```bash
docker build -t angular-dev .

docker images

docker run -it -p 4200:4200 angular-dev

docker compose up

docker ps

docker stop <container-id>
```

---

# Output

The Angular application was successfully deployed inside a Docker container and accessed through:

```
http://localhost:4200
```

Docker Compose was also successfully used to manage the development container.

---

# Learning Outcomes

- Created an Angular application using Angular CLI.
- Built the Angular project.
- Learned Docker image creation.
- Learned Docker container deployment.
- Used Docker Compose for application deployment.
- Understood Docker networking and port mapping.
- Successfully deployed an Angular application using Docker.

---

# Conclusion

This project successfully demonstrates the deployment of an Angular application using Docker and Docker Compose. The application was containerized, executed successfully, and accessed through a web browser. The project provides a basic understanding of containerized Angular application deployment and modern DevOps practices.