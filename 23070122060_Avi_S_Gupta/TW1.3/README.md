# Assignment TW1.3 – Docker and Jenkins Automation

## Student Details
- **Name:** Avi S Gupta
- **PRN:** 23070122060
- **Course:** DevOps Lab L1 (2023–27)

## Objective
The objective of this assignment is to dockerize a web application, verify its container status, run it locally, and automate its build process using a Jenkins CI/CD pipeline.

## Tools Used
- **Docker**: Containerization engine for packaging and running applications in isolated containers.
- **Jenkins**: Open-source automation server for CI/CD pipeline automation.
- **Git**: Version control system to trigger builds.

## Procedure

### Step 1: Docker Build
The web application is containerized by writing a `Dockerfile` and building the image using the `docker build -t <image-name> .` command. This compiles the application and its dependencies into a lightweight, portable image.

![](screenshots/01_docker_build.png)

### Step 2: Container Status
After starting the container, its runtime status is verified using `docker ps`. This displays the container ID, image name, command, creation time, port mappings, and running status.

![](screenshots/02_container_status.png)

### Step 3: Running Application
The application is tested and verified to be running successfully by accessing the exposed host port (e.g. `http://localhost:port`) in a web browser.

![](screenshots/03_running_application.png)

### Step 4: Jenkins Build Commands
A Jenkins pipeline or freestyle project is configured. The build environment triggers script execution commands, such as docker commands, to automate pulling source code and building the application.

![](screenshots/04_jenkins_build_commands.png)

### Step 5: Jenkins Console Output - Part 1
The Jenkins console output captures live build logs. Part 1 shows the build starting, pulling git branch updates, and starting build command execution.

![](screenshots/05_jenkins_console_output_1.png)

### Step 6: Jenkins Console Output - Part 2
The second part of the console output logs the completion of the build script, showing container packaging success and the final Jenkins build status marked as `SUCCESS`.

![](screenshots/06_jenkins_console_output_2.png)

## Result
Successfully containerized the application, verified container status, and configured a Jenkins job that automatically executes build commands and records the build log history.

## Conclusion
Integrating Docker containerization with Jenkins CI/CD automation enables fast, reliable, and standardized application build pipelines.
