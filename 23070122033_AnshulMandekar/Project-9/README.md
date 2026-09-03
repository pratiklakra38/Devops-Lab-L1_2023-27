# Project 9 - Apache2 Server on Kubernetes

Name: Anshul Mandekar  
prn:23070122033

---

## 📌 Project Description
This project demonstrates deploying an Apache2 (httpd) server inside a Kubernetes Deployment using Minikube, and accessing it from the host machine using kubectl commands.

The project includes:
- Apache2 Deployment
- Apache2 Service (NodePort)

## 🛠️ Technologies Used
- Docker
- Kubernetes
- Minikube
- kubectl
- Apache2 (httpd)

## ⚙️ Kubernetes Resources

### 🖥️ Apache Deployment
Runs the Apache2 web server container.
- Image: httpd:latest
- Port: 80

### 🌍 Apache Service
A NodePort Service exposes Apache2 outside the Kubernetes cluster so it can be reached from the host machine.
- Service Name: apache-service
- Port: 80
- NodePort: 30083

## 🚀 Steps to Run the Project
1. Start Docker Desktop
2. Start Minikube
```
minikube start
```
3. Verify the Kubernetes Cluster
```
kubectl get nodes
```
4. Deploy Apache2
```
kubectl apply -f .
```
5. Verify the Pod
```
kubectl get pods
```
6. Verify the Deployment
```
kubectl get deployments
```
7. Verify the Service
```
kubectl get services
```
8. Access Apache2 from the host machine using a K8s command
```
kubectl port-forward service/apache-service 8090:80
```
Then, in a separate terminal:
```
curl.exe http://localhost:8090
```
This forwards Apache's port to the host machine and prints the raw HTML response, confirming the server is reachable outside the cluster.

## 🔄 Project Architecture
```
              Host Machine (your PC)
                      │
              kubectl port-forward
                      │
                      ▼
              ┌────────────────┐
              │ Apache Service │  (NodePort)
              └────────┬───────┘
                       │
              ┌────────────────┐
              │Apache Deployment│
              └────────────────┘
```

## ✅ Project Status
The project was successfully deployed and verified using Minikube.

The following resources were successfully created:
- Apache Deployment
- Apache Service

The Apache2 pod is running successfully, and the server was accessed and verified from the host machine using `kubectl port-forward` and `curl`.