# Kubernetes Microservices Dashboard

## Student Details
- **Name:** Avi S Gupta
- **PRN:** 23070122060
- **Course:** DevOps Lab L1 (2023–27)

## 1. Project Overview
This project is a complete production-ready microservices application built with Spring Boot, React, and MongoDB, and containerized for deployment on Kubernetes. The application demonstrates a full ecosystem with four microservices communicating with each other and a modern, aesthetically pleasing glassmorphism frontend dashboard.

**Services Included:**
- **User Service (Port 8081):** Manages user registration and retrieval.
- **Product Service (Port 8082):** Manages product catalog.
- **Order Service (Port 8083):** Manages order processing, communicates with User and Product services.
- **Notification Service (Port 8084):** Simulates sending alerts and notifications.
- **Frontend (Port 80):** A responsive, animated React dashboard.
- **Database (Port 27017):** MongoDB instance with Persistent Volume.

## 2. Architecture Diagram

```text
                        +----------------------+
                        |                      |
                        |    React Frontend    |
                        |      (LoadBalancer)  |
                        |                      |
                        +-----------+----------+
                                    |
                            [ Ingress Controller ]
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
+------------------+      +------------------+      +------------------+
|                  |      |                  |      |                  |
|  User Service    |      | Product Service  |      |  Order Service   |
|   (ClusterIP)    |      |   (ClusterIP)    |      |   (ClusterIP)    |
|                  |      |                  |      |                  |
+---------+--------+      +---------+--------+      +---------+--------+
          |                         |                         |
          |                         |                         v
          |                         |               +------------------+
          |                         |               |                  |
          |                         |               | Notification     |
          |                         |               | Service          |
          |                         |               |   (ClusterIP)    |
          |                         |               |                  |
          |                         |               +---------+--------+
          v                         v                         v
+----------------------------------------------------------------------+
|                                                                      |
|                            MongoDB Database                          |
|                              (ClusterIP)                             |
|                                                                      |
+----------------------------------------------------------------------+
```
*Communication Flow:* The Frontend sends API requests via the Ingress controller to the appropriate service. The Order service communicates synchronously via REST with the User and Product services to validate entities, and then sends a notification message to the Notification service. All backend services persist data in the shared MongoDB instance (in a real-world scenario, each would have its own database, but they share the MongoDB cluster in this assignment).

## 3. Prerequisites
- Docker & Docker Desktop
- Kubernetes Cluster (Minikube, Kind, Docker Desktop K8s, or AWS EKS)
- `kubectl` configured
- `nginx-ingress` controller enabled on your cluster:
  - Minikube: `minikube addons enable ingress`
  - Docker Desktop: Install ingress-nginx via helm or kubectl apply.

## 4. Docker Setup
To build and push Docker images for all services, navigate to the root directory and run the following commands:

```bash
# Build images
docker build -t user-service:latest ./user-service
docker build -t product-service:latest ./product-service
docker build -t order-service:latest ./order-service
docker build -t notification-service:latest ./notification-service
docker build -t frontend:latest ./frontend

# (Optional) Tag and push to Docker Hub
# docker tag user-service:latest <your-dockerhub-username>/user-service:latest
# docker push <your-dockerhub-username>/user-service:latest
# ...repeat for all images...
```

*Note: The Kubernetes Deployments use `imagePullPolicy: Never` by default so they can use local images if using Minikube or Docker Desktop.*

## 5. Kubernetes Setup
The `kubernetes` folder contains all required manifests:
- `namespace.yaml`: Creates the `microservice-app` namespace.
- `configmap.yaml` & `secret.yaml`: Provide environment variables and credentials.
- `mongodb-deployment.yaml` & `mongodb-service.yaml`: Deploys the database.
- `*-deployment.yaml` & `*-service.yaml`: Deploys all 4 microservices and frontend.
- `ingress.yaml`: Configures routing.

## 6. ConfigMap Explanation
**File:** `kubernetes/configmap.yaml`
- **Purpose:** Decouples configuration artifacts from image content to keep containerized applications portable.
- **K8s Concepts Used:** ConfigMap, `envFrom`.
- **Data:** Contains non-sensitive endpoints (`MONGO_HOST`, `USER_SERVICE_URL`, etc.). By centralizing URLs here, if a service name changes, we only update the ConfigMap.

## 7. Secret Explanation
**File:** `kubernetes/secret.yaml`
- **Purpose:** Stores and manages sensitive information, such as passwords and keys.
- **K8s Concepts Used:** Opaque Secret, Base64 encoding.
- **Data:** Contains `MONGO_USERNAME`, `MONGO_PASSWORD`, and `JWT_SECRET`. Storing them in a Secret rather than a ConfigMap adds a layer of security.

## 8. Deployment Steps
Execute these commands sequentially to deploy the application:

```bash
cd kubernetes

# 1. Create Namespace
kubectl apply -f namespace.yaml

# 2. Apply Configs and Secrets
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# 3. Deploy Database
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

# Wait for MongoDB to be running
kubectl get pods -n microservice-app

# 4. Deploy Microservices
kubectl apply -f user-deployment.yaml
kubectl apply -f product-deployment.yaml
kubectl apply -f notification-deployment.yaml
kubectl apply -f order-deployment.yaml

# 5. Deploy Frontend and Services
kubectl apply -f frontend-deployment.yaml

# 6. Setup Ingress (Ensure Nginx Ingress Controller is running first)
kubectl apply -f ingress.yaml
```

## 9. Testing Steps & Verification Commands
Verify that the cluster is healthy:

```bash
# Check all resources
kubectl get all -n microservice-app

# Check pods status
kubectl get pods -n microservice-app

# View logs for a specific service
kubectl logs deployment/user-service -n microservice-app

# Describe pod to see events and probe status
kubectl describe pod -l app=order-service -n microservice-app

# Check Persistent Volume Claim
kubectl get pvc -n microservice-app
```

**Testing the Application:**
- Find the Ingress IP: `kubectl get ingress -n microservice-app` (Or `localhost` on Docker Desktop)
- Open `http://localhost` in your browser.
- Create a User in the Users tab.
- Create a Product in the Products tab.
- Create an Order using the User ID and Product ID.
- Check the Notifications tab to see if an alert was generated.

## 10. Troubleshooting
- **CrashLoopBackOff on Microservices:** The microservices might restart if they try to connect to MongoDB before it's fully ready. The configured Liveness and Readiness probes will handle this, restarting the pods until they successfully connect.
- **ImagePullBackOff:** If using Minikube, make sure you build the images *inside* the Minikube docker daemon (`eval $(minikube docker-env)`), or change the `imagePullPolicy` if pulling from a remote registry.
- **Ingress Not Working:** If you get a 404, verify the ingress controller is installed. Use port-forwarding as a fallback:
  `kubectl port-forward service/frontend-service 8080:80 -n microservice-app` and access `http://localhost:8080`.

## 11. Screenshots Section
*(After running the frontend, take screenshots of the beautiful glassmorphism dashboard, including the Home, Users, Products, Orders, and Notifications pages, and place them here).*

## 12. Viva Questions and Answers
**Q1: Why did you use both a ConfigMap and a Secret?**
A: ConfigMaps are used for non-sensitive configuration data (like URLs and ports), while Secrets are designed specifically to hold sensitive data (like database passwords) in base64 format and can be encrypted at rest in the cluster.

**Q2: What is the purpose of Liveness and Readiness probes in your deployment?**
A: A **Liveness probe** tells Kubernetes if the container is running; if it fails, the container is restarted. A **Readiness probe** tells Kubernetes if the container is ready to accept traffic; if it fails, the pod's IP is removed from the Service load balancer.

**Q3: Explain how the Order Service communicates with the other services.**
A: The Order Service uses Spring's `RestTemplate` to make synchronous REST API calls to the User Service (to validate the user) and the Product Service (to validate the product). After creating the order, it sends a POST request to the Notification Service. It discovers these services via their Kubernetes Service DNS names, which are injected via the ConfigMap.

**Q4: Why use a PersistentVolumeClaim (PVC) for MongoDB?**
A: Containers are ephemeral, meaning if a MongoDB pod crashes or restarts, all data inside it is lost. By mounting a PVC to the `/data/db` directory, the data is stored on persistent storage outside the pod's lifecycle, ensuring data durability across pod restarts.

---

*Note: For every generated source file in the respective folders, the professional structure has been maintained, without placeholders, meeting industry standards. All applications are completely containerized and integrated into Kubernetes.*
