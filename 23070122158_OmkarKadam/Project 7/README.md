# Project 7: Create Mongo and Mongo Express Deployments

## Objective
Create Mongo and Mongo Express deployments, services, configmaps, and secrets in Kubernetes.

## Step-by-Step Guide

### Step 1: Create a Secret for MongoDB
Create `mongo-secret.yaml` to store the database credentials securely.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
type: Opaque
data:
  # Echo 'admin' | base64
  mongo-root-username: YWRtaW4= 
  # Echo 'password' | base64
  mongo-root-password: cGFzc3dvcmQ= 
```
```bash
kubectl apply -f mongo-secret.yaml
```

### Step 2: Create a ConfigMap for Mongo Express
Create `mongo-configmap.yaml` to store the database URL connection string.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongodb-configmap
data:
  mongo-url: mongodb
```
```bash
kubectl apply -f mongo-configmap.yaml
```

### Step 3: Create the MongoDB Deployment and Service
Create `mongo-deployment.yaml`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-username
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-password
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
spec:
  selector:
    app: mongodb
  ports:
  - protocol: TCP
    port: 27017
    targetPort: 27017
```
```bash
kubectl apply -f mongo-deployment.yaml
```

### Step 4: Create Mongo Express Deployment and Service
Create `mongo-express-deployment.yaml`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo-express
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo-express
  template:
    metadata:
      labels:
        app: mongo-express
    spec:
      containers:
      - name: mongo-express
        image: mongo-express
        ports:
        - containerPort: 8081
        env:
        - name: ME_CONFIG_MONGODB_ADMINUSERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-username
        - name: ME_CONFIG_MONGODB_ADMINPASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-password
        - name: ME_CONFIG_MONGODB_SERVER
          valueFrom:
            configMapKeyRef:
              name: mongodb-configmap
              key: mongo-url
---
apiVersion: v1
kind: Service
metadata:
  name: mongo-express-service
spec:
  selector:
    app: mongo-express
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 8081
    targetPort: 8081
```
```bash
kubectl apply -f mongo-express-deployment.yaml
```

### Step 5: Access Mongo Express
If you are using Minikube, run:
```bash
minikube service mongo-express-service
```
This will open the Mongo Express UI in your browser where you can manage your MongoDB database.
