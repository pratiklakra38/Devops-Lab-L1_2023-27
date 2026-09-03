# Project 9: Create Apache2 Server within a K8s Deployment

## Objective
Create an `apache2` server within a Kubernetes deployment and access it from the host machine using Kubernetes commands.

## Step-by-Step Guide

### Step 1: Create the Deployment Manifest
Create a file named `apache-deployment.yaml` to define the deployment using the official `httpd` (Apache) Docker image.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apache-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: httpd
        image: httpd:2.4
        ports:
        - containerPort: 80
```

Apply the deployment:
```bash
kubectl apply -f apache-deployment.yaml
```

### Step 2: Verify the Deployment
Ensure that the pod is successfully running.
```bash
kubectl get deployments
kubectl get pods
```

### Step 3: Expose the Deployment with a Service
Create a `Service` of type `NodePort` so the Apache server is accessible from your host machine.
Create a file named `apache-service.yaml`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: apache-service
spec:
  type: NodePort
  selector:
    app: web
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080
```

Apply the service:
```bash
kubectl apply -f apache-service.yaml
```
*(Alternatively, use the imperative command: `kubectl expose deployment apache-server --type=NodePort --port=80`)*

### Step 4: Access the Apache Server
To access the server from your host machine, you need your cluster's IP address and the NodePort (`30080` in this example).

If you are using Minikube, you can run:
```bash
minikube service apache-service
```
Or simply get the minikube IP:
```bash
minikube ip
```
Then open your web browser and go to:
`http://<MINIKUBE_IP>:30080`

You should see the default Apache "It works!" page.
