# Project 8 – Kubernetes Deployment of a Multi-Microservice Application

**Student Name:** Pratik Lakra  
**PRN:** 23070122166

## Project Description

This project demonstrates the deployment of a multi-microservice application on Kubernetes, consisting of a Frontend, Product, Customer, and Order service. Configuration and credentials are managed using a ConfigMap and a Secret, while each microservice is deployed and exposed independently using Deployments and Services. Kubernetes handles container orchestration, internal service communication, and external access to the application.

## Objective

- Deploy multiple microservices on Kubernetes using Deployments and Services
- Manage application configuration using a ConfigMap
- Manage sensitive credentials using a Secret
- Expose internal services using ClusterIP and the Frontend using NodePort
- Verify all Kubernetes resources are running correctly
- Access the Frontend application from a browser

## Technologies Used

| Technology | Purpose |
|---|---|
| Kubernetes | Container orchestration platform |
| Minikube | Local Kubernetes cluster |
| kubectl | Kubernetes command-line tool |
| Docker | Containerization platform |
| YAML | Configuration file format |

## Prerequisites

- Docker Desktop
- Minikube
- kubectl
- Kubernetes Cluster
- Microservice Docker Images (Frontend, Product, Customer, Order)

## Project Structure

```
Project-8/
│
├── app-configmap.yaml
├── app-secret.yaml
│
├── frontend-deployment.yaml
├── frontend-service.yaml
│
├── product-deployment.yaml
├── product-service.yaml
│
├── customer-deployment.yaml
├── customer-service.yaml
│
├── order-deployment.yaml
├── order-service.yaml
│
├── screenshots/
│
├── README.md
│
└── .gitignore
```

## Kubernetes Architecture

```
Browser
   │
   ▼
Frontend Service (NodePort)
   │
   ▼
Frontend Deployment
   │
   ▼
Frontend Pod
   │
   ▼
Product Service
   │
   ▼
Product Pod
   │
   ▼
Customer Service
   │
   ▼
Customer Pod
   │
   ▼
Order Service
   │
   ▼
Order Pod
```

ConfigMap supplies configuration.
Secret supplies credentials.

## Implementation

### Step 1: Create ConfigMap

A ConfigMap was created to store non-sensitive configuration data used by the microservices.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-configmap
data:
  APP_ENV: production
  SERVICE_TIMEOUT: "30"
```

```bash
kubectl apply -f app-configmap.yaml
```

![ConfigMap](/02_configmap_created.png)
Confirmation that the ConfigMap was created successfully in the cluster.

### Step 2: Create Secret

A Secret was created to securely store sensitive credentials required by the microservices.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DB_USERNAME: YWRtaW4=
  DB_PASSWORD: cGFzc3dvcmQ=
```

```bash
kubectl apply -f app-secret.yaml
```

![Secret](/03_secret_created.png)
Confirmation that the Secret was created successfully in the cluster.

### Step 3: Frontend Deployment

A Deployment was created to manage the Frontend microservice pods.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  labels:
    app: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: frontend-service:latest
          envFrom:
            - configMapRef:
                name: app-configmap
            - secretRef:
                name: app-secret
          ports:
            - containerPort: 80
```

![Frontend Deployment](screenshots/04_frontend_deployment_yaml.png)
The Deployment YAML file defining the Frontend microservice configuration.

### Step 4: Frontend Service

A NodePort Service was created to expose the Frontend microservice externally.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30081
```

![Frontend Service](screenshots/05_frontend_service_yaml.png)
The Service YAML file exposing the Frontend Deployment using NodePort.

```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

![Frontend Running](screenshots/06_frontend_running.png)
Confirmation that the Frontend Deployment and Service were applied successfully.

### Step 5: Product Deployment and Service

A Deployment and ClusterIP Service were created for the Product microservice, handling internal communication within the cluster.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-deployment
  labels:
    app: product
spec:
  replicas: 2
  selector:
    matchLabels:
      app: product
  template:
    metadata:
      labels:
        app: product
    spec:
      containers:
        - name: product
          image: product-service:latest
          envFrom:
            - configMapRef:
                name: app-configmap
            - secretRef:
                name: app-secret
          ports:
            - containerPort: 8081
```

![Product Deployment](screenshots/07_product_deployment_yaml.png)
The Deployment YAML file defining the Product microservice configuration.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: product-service
spec:
  type: ClusterIP
  selector:
    app: product
  ports:
    - port: 8081
      targetPort: 8081
```

![Product Service](screenshots/08_product_service_yaml.png)
The Service YAML file exposing the Product Deployment internally using ClusterIP.

```bash
kubectl apply -f product-deployment.yaml
kubectl apply -f product-service.yaml
```

![Product Running](screenshots/09_product_running_1.png)
Verification output showing the Product Deployment running successfully.

![Product Running](screenshots/09_product_running_2.png)
Verification output showing the Product Service running successfully.

### Step 6: Customer Deployment and Service

A Deployment and ClusterIP Service were created for the Customer microservice, handling internal communication within the cluster.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: customer-deployment
  labels:
    app: customer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: customer
  template:
    metadata:
      labels:
        app: customer
    spec:
      containers:
        - name: customer
          image: customer-service:latest
          envFrom:
            - configMapRef:
                name: app-configmap
            - secretRef:
                name: app-secret
          ports:
            - containerPort: 8082
```

![Customer Deployment](screenshots/10_customer_deployment_yaml.png)
The Deployment YAML file defining the Customer microservice configuration.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: customer-service
spec:
  type: ClusterIP
  selector:
    app: customer
  ports:
    - port: 8082
      targetPort: 8082
```

![Customer Service](screenshots/11_customer_service_yaml.png)
The Service YAML file exposing the Customer Deployment internally using ClusterIP.

```bash
kubectl apply -f customer-deployment.yaml
kubectl apply -f customer-service.yaml
```

### Step 7: Order Deployment and Service

A Deployment and ClusterIP Service were created for the Order microservice, handling internal communication within the cluster.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-deployment
  labels:
    app: order
spec:
  replicas: 2
  selector:
    matchLabels:
      app: order
  template:
    metadata:
      labels:
        app: order
    spec:
      containers:
        - name: order
          image: order-service:latest
          envFrom:
            - configMapRef:
                name: app-configmap
            - secretRef:
                name: app-secret
          ports:
            - containerPort: 8083
```

![Order Deployment](screenshots/12_order_deployment_yaml.png)
The Deployment YAML file defining the Order microservice configuration.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  type: ClusterIP
  selector:
    app: order
  ports:
    - port: 8083
      targetPort: 8083
```

![Order Service](screenshots/13_order_service_yaml.png)
The Service YAML file exposing the Order Deployment internally using ClusterIP.

```bash
kubectl apply -f order-deployment.yaml
kubectl apply -f order-service.yaml
```

### Step 8: Verify Resources

All Kubernetes resources were verified to confirm that the microservices, configuration, and credentials were deployed correctly.

```bash
kubectl get deployments
kubectl get pods
kubectl get svc
kubectl get configmaps
kubectl get secrets
kubectl get all
```

![Deployments](screenshots/14_all_deployments_running.png)
Output showing all four microservice Deployments running with the desired replicas.

![Pods](screenshots/15_all_pods_running.png)
Output showing all microservice pods in the Running state.

![Services](screenshots/16_all_services_running.png)
Output showing all Services, including the Frontend NodePort and internal ClusterIP Services.

![ConfigMap](screenshots/17_configmap_verified.png)
Verification confirming the ConfigMap is present in the cluster.

![Secret](screenshots/18_secret_verified.png)
Verification confirming the Secret is present in the cluster.

![Resources](screenshots/19_all_kubernetes_resources.png)
Combined output listing all active Kubernetes resources for the application.

### Step 9: Access Frontend

The Frontend application was accessed using Minikube's service command, which opens the exposed NodePort Service in the default browser.

```bash
minikube service frontend-service
```

![Frontend Browser](screenshots/20_frontend_application_1.png)
The Frontend application successfully loaded in the browser.

![Frontend Browser](screenshots/20_frontend_application_2.png)
Additional view confirming the Frontend was accessed successfully.

The frontend was successfully accessed using the NodePort Service.

### Step 10: Final Cluster State

Resources from the previous MongoDB project were removed before capturing the final cluster state, so that only the microservice application resources are displayed.

```bash
kubectl get all
```

![Final Cluster](screenshots/21_final_cluster_state.png)
The final cluster state showing only the Frontend, Product, Customer, and Order resources.

## Kubernetes Workflow

```
ConfigMap
   │
   ▼
Deployments
   │
   ▼
Pods
   │
   ▼
Services
   │
   ▼
Frontend (NodePort)
   │
   ▼
Browser
```

Secret is injected into all deployments.

## Kubernetes Components Used

| Component | Purpose |
|---|---|
| Deployment | Manages the desired state and lifecycle of microservice pods |
| Pod | Runs an individual microservice container instance |
| ReplicaSet | Ensures the specified number of pod replicas are running |
| Service | Enables communication between microservices and external access |
| ClusterIP | Exposes internal microservices within the cluster only |
| NodePort | Exposes the Frontend Service to external traffic |
| ConfigMap | Supplies non-sensitive configuration data to the microservices |
| Secret | Supplies sensitive credentials to the microservices |

## Commands Used

### Deployment Commands

```bash
kubectl apply -f app-configmap.yaml
kubectl apply -f app-secret.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f product-deployment.yaml
kubectl apply -f product-service.yaml
kubectl apply -f customer-deployment.yaml
kubectl apply -f customer-service.yaml
kubectl apply -f order-deployment.yaml
kubectl apply -f order-service.yaml
```

### Verification Commands

```bash
kubectl get deployments
kubectl get pods
kubectl get svc
kubectl get configmaps
kubectl get secrets
kubectl get all
```

### Application Access Commands

```bash
minikube service frontend-service
```

## Build Result

ConfigMap Created Successfully

Secret Created Successfully

Frontend Deployment Created Successfully

Product Deployment Created Successfully

Customer Deployment Created Successfully

Order Deployment Created Successfully

All Services Running Successfully

Frontend Accessible Successfully

Final Kubernetes Cluster Status: SUCCESS

## Learning Outcomes

- Deployments
- Pods
- ReplicaSets
- Services
- ConfigMaps
- Secrets
- NodePort
- ClusterIP
- Microservices
- Kubernetes Networking

## Conclusion

This project successfully demonstrated the deployment of a multi-microservice application on Kubernetes. The Frontend, Product, Customer, and Order microservices were deployed using Deployments and Services, with configuration and credentials managed through a ConfigMap and a Secret. All resources were verified, and the Frontend application was successfully accessed through a NodePort Service, reinforcing key concepts of Kubernetes microservice architecture and networking.
