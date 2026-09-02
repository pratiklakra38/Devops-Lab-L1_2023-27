# Project 8: Complete Microservices Application on Kubernetes

## Objective
Create a complete containerized application with at least four microservices using Kubernetes Deployments, Services, ConfigMap and Secret.

## Microservices
1. Frontend – Nginx
2. Backend – Flask
3. Flask service – Flask application
4. Redis – Redis service

## Kubernetes Resources

### Deployments
- `project8-frontend`
- `project8-backend`
- `project8-flask`
- `project8-redis`

### Services
- `project8-frontend-service`
- `project8-backend-service`
- `project8-flask-service`
- `project8-redis-service`

### Configuration
- `app-config` – ConfigMap
- `app-secret` – Secret

## Work Done
- Created Deployments for four microservices.
- Created Services for communication between components.
- Created a ConfigMap and Secret.
- Configured Nginx to forward `/api/` requests to the Flask backend.
- Verified frontend-to-backend communication using Kubernetes service discovery.
- Verified backend-to-Redis communication.
- Exposed the frontend using NodePort.
- Accessed the frontend from the host machine using Minikube.

## Commands Used
```powershell
kubectl apply -f project8.yaml
kubectl get deployments
kubectl get services
kubectl get configmaps
kubectl get secrets
kubectl get pods
kubectl get endpoints project8-backend-service
kubectl logs deployment/project8-backend
kubectl logs deployment/project8-frontend
minikube service project8-frontend-service
```

## Backend Verification
```powershell
kubectl exec deployment/project8-frontend -- wget -qO- http://project8-backend-service:5000
```

The backend returned a response confirming that the backend and Redis were connected.

## Result
The four-microservice application was successfully deployed on Kubernetes with Deployments, Services, ConfigMap and Secret. The frontend was exposed through NodePort and accessed from the host machine.

## Conclusion
This project demonstrated how Kubernetes can deploy, configure, connect and expose a multi-microservice application.
