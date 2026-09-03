# Project 9 - Apache Server on Kubernetes

## Project objective
This project deploys an Apache HTTP server in Kubernetes and exposes it to the host machine using a NodePort service.

## Apache Deployment
The deployment creates a single Apache container using the `httpd:latest` image.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apache-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: apache-server
  template:
    metadata:
      labels:
        app: apache-server
    spec:
      containers:
        - name: apache
          image: httpd:latest
          ports:
            - containerPort: 80
```

## Apache NodePort Service
The service exposes the Apache server on a NodePort so it can be accessed from the host machine.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: apache-server
spec:
  type: NodePort
  selector:
    app: apache-server
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```

## Commands used to deploy and verify it
```bash
kubectl apply -f apache.yaml
kubectl get deployment
kubectl get pods
kubectl get svc
kubectl describe svc apache-server
```

## How the Apache server is accessed from the host machine
The service listens on the Kubernetes node's IP at the NodePort `30080`.

```bash
curl http://localhost:30080
```

If needed, replace `localhost` with the actual node IP or VM IP address:

```bash
curl http://<NODE_IP>:30080
```

This confirms the Apache server is running and reachable from the host machine.
