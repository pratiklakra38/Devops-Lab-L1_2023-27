# Project 8 - Kubernetes Microservices

This project contains a complete Kubernetes application with four microservices:

- Frontend (Nginx-based UI with reverse proxy)
- Backend (Node.js API service)
- Flask (Python Flask service)
- Redis (in-memory data store)

## Included resources

- `app-config` ConfigMap
- `app-secret` Secret
- `project8-frontend` Deployment + NodePort Service
- `project8-backend` Deployment + ClusterIP Service
- `project8-flask` Deployment with 2 replicas + ClusterIP Service
- `project8-redis` Deployment + ClusterIP Service
- NGINX reverse proxy configuration
- Frontend static HTML page

## Service names

- Frontend reverse proxy route:
  - `/api/` -> `project8-backend-service:5000`
- Redis service:
  - `project8-redis-service:6379`

## Deployment

Apply the Kubernetes manifests in this order:

```bash
kubectl apply -f project8.yaml
kubectl apply -f frontend-fix.yaml
```

## Frontend access

The frontend is exposed via NodePort service:

```bash
http://<node-ip>:30080
```

## Files included

- `project8.yaml`
- `frontend-fix.yaml`
- `frontend-index.html`
- `nginx.conf`
- `README.md`

## Notes

The frontend HTML and NGINX configuration are aligned to route frontend API traffic to the backend service while keeping the Redis service name consistent with the Kubernetes service definition.
