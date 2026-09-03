# Project 7: MongoDB and Mongo Express on Kubernetes

## Project objective
This project deploys MongoDB and Mongo Express on Kubernetes using a Secret for database credentials, a ConfigMap for the MongoDB database name, and Kubernetes services to expose both workloads.

## Secret
The Secret named `mongo-secret` stores the MongoDB root credentials.

```yaml
stringData:
  mongo-root-username: admin
  mongo-root-password: password123
```

## ConfigMap
The ConfigMap named `mongo-config` provides the database name used by the application.

```yaml
data:
  mongo-database: socialmedia
```

## MongoDB Deployment and Service
The MongoDB Deployment creates one pod named `mongo` using the official `mongo:7` image and exposes port `27017`.

- Deployment name: `mongo`
- Service name: `mongo-service`
- Selector: `app: mongo`
- Port: `27017`
- Target port: `27017`

The MongoDB root credentials are loaded from the `mongo-secret` Secret.

## Mongo Express Deployment and Service
The Mongo Express Deployment creates one pod named `mongo-express` using the `mongo-express:1.0.2` image and exposes port `8081`.

- Deployment name: `mongo-express`
- Service name: `mongo-express-service`
- Type: `NodePort`
- Selector: `app: mongo-express`
- Port: `8081`
- Target port: `8081`

The application is configured to connect to MongoDB through the `mongo-service` service using the admin username and password from the `mongo-secret` Secret.

## Commands required to apply and verify the deployment
```bash
kubectl apply -f mongo.yaml
kubectl get secret mongo-secret
kubectl get configmap mongo-config
kubectl get deployment mongo mongo-express
kubectl get service mongo-service mongo-express-service
kubectl get pods
kubectl describe deployment mongo
kubectl describe deployment mongo-express
```

## How to access Mongo Express using kubectl port-forward
Run the following command:

```bash
kubectl port-forward service/mongo-express-service 8081:8081
```

Then open Mongo Express in a browser at:

```text
http://localhost:8081
```

This allows you to access the Mongo Express UI locally on port `8081`.
