# Project 7: MongoDB and Mongo Express on Kubernetes

## Student Details
- **Name:** Avi S Gupta
- **PRN:** 23070122060
- **Course:** DevOps Lab L1 (2023–27)

## Objective
To deploy a MongoDB database on Kubernetes together with the Mongo Express web client,
passing credentials through a Secret and connection details through a ConfigMap, and
exposing the client outside the cluster through a LoadBalancer Service.

## Manifests

| File | Kind | Purpose |
|---|---|---|
| `mongo-secret.yaml` | Secret | MongoDB root username and password, base64 encoded |
| `mongo-configmap.yaml` | ConfigMap | MongoDB service URL for Mongo Express to read |
| `mongo.yaml` | Deployment + Service | Runs `mongo:8` on port 27017, exposed internally |
| `mongo-express.yaml` | Deployment + Service | Runs `mongo-express:1.0.2` on port 8081, exposed as LoadBalancer |

## Apply Order
Secret and ConfigMap first, because the Deployments read from them at startup.

```bash
kubectl apply -f mongo-secret.yaml
kubectl apply -f mongo-configmap.yaml
kubectl apply -f mongo.yaml
kubectl apply -f mongo-express.yaml
kubectl get pods,svc
```

## Key Points
- The MongoDB Service is internal only; Mongo Express reaches it by service name.
- Credentials live in a Secret rather than in the Deployment, so they are not committed
  in plain text and can be rotated without editing the Deployment.
- Mongo Express uses `type: LoadBalancer`, which is what makes the UI reachable from
  outside the cluster.

## Screenshots
Execution screenshots are in `screeshot/`.
