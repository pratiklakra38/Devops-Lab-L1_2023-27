# SocialSphere --- Docker & Kubernetes Deployment

## 1. Project Overview

SocialSphere is a full-stack web application with:

-   **Backend:** Node.js + Express + Prisma + PostgreSQL
-   **Frontend:** Next.js 16 + React 19
-   **Containerization:** Docker
-   **Orchestration:** Kubernetes
-   **Local Kubernetes cluster:** Kind running through Docker Desktop
-   **Autoscaling:** Kubernetes Horizontal Pod Autoscaler (HPA)
-   **Metrics:** Kubernetes Metrics Server

The final project location used for this setup was:

``` text
D:\Devops-Lab-L1_2023-27\23070122113_ShivamKapure\Project6\socialsphere
```

------------------------------------------------------------------------

## 2. Docker Setup

### 2.1 Backend Docker image

The backend was built from the `backend` directory:

``` powershell
docker build -t socialsphere-backend ./backend
```

The backend image was successfully built.

![Backend Docker build](screenshots/01-docker-build-backend.png)

### 2.2 Frontend Docker image

The frontend was built with the public API URL supplied as a build
argument:

``` powershell
docker build -t socialsphere-frontend --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 ./frontend
```

![Frontend Docker build](screenshots/02-docker-build-frontend.png)

### 2.3 Backend environment for Docker

A separate Docker environment file was used so that PostgreSQL could be
reached from inside the backend container.

`backend/.env.docker`:

``` env
DATABASE_URL=postgresql://griduser:gridpassword@host.docker.internal:5432/socialsphere?schema=public
PORT=3001
NODE_ENV=development
```

The important difference from local development is that the Docker
container must not use `localhost` to reach the host PostgreSQL
instance. `host.docker.internal` was used instead.

### 2.4 Run the backend container

``` powershell
docker run --name socialsphere-backend -p 3001:3001 --env-file .\backend\.env.docker socialsphere-backend
```

The backend started on port `3001`.

![Backend container running](screenshots/03-docker-run-backend.png)

### 2.5 Run the frontend container

The frontend was exposed on host port `3002` because another application
was already using port `3000`:

``` powershell
docker run --name socialsphere-frontend -p 3002:3000 socialsphere-frontend
```

Inside the container, Next.js still runs on port `3000`; Docker maps it
to host port `3002`.

![Frontend container running](screenshots/04-docker-run-frontend.png)

------------------------------------------------------------------------

## 3. Kubernetes Cluster

Docker Desktop was used with a Kind Kubernetes cluster named `desktop`.

Kind was installed on Windows and verified:

``` powershell
kind --version
```

The cluster was checked with:

``` powershell
kind get clusters
```

The result included:

``` text
desktop
```

The Docker images were then loaded into the Kind node because
`imagePullPolicy: Never` was used for the local SocialSphere images:

``` powershell
kind load docker-image socialsphere-backend:latest --name desktop
kind load docker-image socialsphere-frontend:latest --name desktop
```

![Kind cluster](screenshots/06-kind-cluster-and-images.png)

The local Docker images were then loaded into the Kind node:

![Kind image loading](screenshots/07-kind-load-images.png)

------------------------------------------------------------------------

## 4. Kubernetes Namespace

A dedicated namespace was created:

`k8s/namespace.yaml`

``` yaml
apiVersion: v1
kind: Namespace
metadata:
  name: socialsphere
```

Apply it:

``` powershell
kubectl apply -f .\k8s\namespace.yaml
```

Verify:

``` powershell
kubectl get namespace socialsphere
```

![Kubernetes namespace](screenshots/05-kubernetes-namespace.png)

------------------------------------------------------------------------

## 5. Backend Kubernetes Deployment

The backend deployment was created with two replicas.

Apply:

``` powershell
kubectl apply -f .\k8s\backend-deployment.yaml
```

Check:

``` powershell
kubectl get deployment -n socialsphere
kubectl get pods -n socialsphere
```

The backend deployment ultimately ran with two healthy replicas.

> **Note:** During the setup, the Pods initially showed
> `ErrImageNeverPull`. This happened because the local Docker image had
> not yet been loaded into the Kind node. Loading the image with
> `kind load docker-image` and restarting the deployment resolved the
> issue.

The successful image-loading/restart process is shown in the Kind
screenshot above.

------------------------------------------------------------------------

## 6. Backend Kubernetes Service

The backend was exposed internally through a ClusterIP service on port
`3001`.

Apply:

``` powershell
kubectl apply -f .\k8s\backend-service.yaml
```

Verify:

``` powershell
kubectl get service -n socialsphere
kubectl get endpoints -n socialsphere
```

The backend service received endpoints corresponding to the running
backend Pods.

------------------------------------------------------------------------

## 7. Frontend Kubernetes Deployment

The frontend deployment was created with two replicas:

``` powershell
kubectl apply -f .\k8s\frontend-deployment.yaml
```

Verify:

``` powershell
kubectl get deployment -n socialsphere
kubectl get pods -n socialsphere
```

The frontend Pods reached `1/1 Running`.

------------------------------------------------------------------------

## 8. Frontend Kubernetes Service

The frontend was exposed using a NodePort service.

Apply:

``` powershell
kubectl apply -f .\k8s\frontend-service.yaml
```

Verify:

``` powershell
kubectl get service -n socialsphere
```

The service used:

``` text
Type: NodePort
Container port: 3000
NodePort: 30176
```

A port-forward was also used during testing:

``` powershell
kubectl port-forward -n socialsphere service/socialsphere-frontend 3002:3000
```

![Frontend Kubernetes service](screenshots/08-kubernetes-services.png)

The SocialSphere frontend was successfully accessible in the browser.

![SocialSphere frontend](screenshots/09-frontend-in-browser.png)

------------------------------------------------------------------------

## 9. Backend Health and Readiness

The backend provides:

``` text
/health
/ready
```

The endpoints were tested successfully while the Kubernetes backend was
running.

Expected responses:

``` json
{"status":"ok"}
```

and:

``` json
{"status":"ready"}
```

The readiness endpoint also verifies that the backend can reach its
database.

------------------------------------------------------------------------

## 10. Metrics Server

The Kubernetes Metrics Server was installed so that CPU and memory
metrics could be used by the HPA.

The release manifest was downloaded:

``` powershell
curl.exe -L -o metrics-server.yaml https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Then applied:

``` powershell
kubectl apply -f .\metrics-server.yaml
```

Because the local Kind/Docker Desktop Kubelet certificate did not
contain the node IP as an IP SAN, the Metrics Server configuration was
adjusted to include:

``` text
--kubelet-insecure-tls
```

This allowed Metrics Server to scrape the Kind node successfully.

Verify:

``` powershell
kubectl get pods -n kube-system | findstr metrics
```

The Metrics Server eventually reached:

``` text
1/1 Running
```

![Metrics Server installation](screenshots/10-metrics-server.png)

Metrics were then available through:

``` powershell
kubectl top nodes
kubectl top pods -n socialsphere
```

------------------------------------------------------------------------

## 11. Horizontal Pod Autoscaler (HPA)

The backend HPA was configured in:

``` text
k8s/backend-hpa.yaml
```

Configuration:

``` yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: socialsphere-backend
  namespace: socialsphere
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: socialsphere-backend
  minReplicas: 2
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60
```

Apply:

``` powershell
kubectl apply -f .\k8s\backend-hpa.yaml
```

Check:

``` powershell
kubectl get hpa -n socialsphere
```

Initial state:

``` text
MINPODS = 2
MAXPODS = 5
CPU target = 60%
REPLICAS = 2
```

![HPA before load](screenshots/11-hpa-before-load.png)

------------------------------------------------------------------------

## 12. Autoscaling Test

A temporary BusyBox Pod was used to generate continuous requests to the
backend service:

``` powershell
kubectl run load-generator -n socialsphere --image=busybox:1.36 --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://socialsphere-backend:3001/health > /dev/null; done"
```

Verify:

``` powershell
kubectl get pod load-generator -n socialsphere
```

Expected:

``` text
load-generator   1/1   Running
```

![Load generator](screenshots/12-load-generator-start.png)

### Watching the HPA

The HPA was monitored continuously:

``` powershell
kubectl get hpa -n socialsphere -w
```

During the load test, CPU utilization rose above the 60% target and
Kubernetes automatically increased the backend replicas.

Observed scaling included:

``` text
CPU 151% / 60%  -> 4 replicas
CPU 104% / 60%  -> 5 replicas
```

The HPA reached its configured maximum of **5 backend replicas**.

![HPA scale-up](screenshots/13-hpa-scale-up.png)

The backend Pods were then observed running at the scaled count:

![Scaled backend Pods](screenshots/14-scaled-backend-pods.png)

------------------------------------------------------------------------

## 13. Stop the Load Test

After demonstrating autoscaling, the temporary load generator was
removed:

``` powershell
kubectl delete pod load-generator -n socialsphere
```

![Stop load generator](screenshots/15-stop-load-generator.png)

After the load is removed, the HPA can reduce the backend deployment
back toward its configured minimum of two replicas.

------------------------------------------------------------------------

## 14. Final Kubernetes Commands

Useful commands for verifying the completed deployment:

### Pods

``` powershell
kubectl get pods -n socialsphere
```

### Deployments

``` powershell
kubectl get deployment -n socialsphere
```

### Services

``` powershell
kubectl get service -n socialsphere
```

### Metrics

``` powershell
kubectl top nodes
kubectl top pods -n socialsphere
```

### HPA

``` powershell
kubectl get hpa -n socialsphere
kubectl describe hpa socialsphere-backend -n socialsphere
```

### All resources

``` powershell
kubectl get all -n socialsphere
```

------------------------------------------------------------------------

## 15. Kubernetes Files

The final Kubernetes configuration is organized under:

``` text
k8s/
├── namespace.yaml
├── backend-deployment.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
└── backend-hpa.yaml
```

The Metrics Server manifest used during setup was:

``` text
metrics-server.yaml
```

------------------------------------------------------------------------

## 16. Final Result

The SocialSphere application was successfully:

1.  Containerized with Docker.
2.  Configured to connect to PostgreSQL from the backend container.
3.  Built as separate frontend and backend Docker images.
4.  Deployed to a local Kind Kubernetes cluster.
5.  Organized in a dedicated `socialsphere` namespace.
6.  Deployed with two backend replicas and two frontend replicas.
7.  Exposed through Kubernetes Services.
8.  Verified using backend health and readiness endpoints.
9.  Connected to Kubernetes Metrics Server.
10. Configured with an HPA using CPU utilization.
11. Demonstrated to automatically scale the backend from **2 up to 5
    replicas** under load.
12. Tested for cleanup after the load generator was removed.

### Autoscaling result

``` text
Normal load
    ↓
2 backend replicas
    ↓
Load generator starts
    ↓
CPU rises above 60%
    ↓
HPA increases replicas
    ↓
4 replicas
    ↓
5 replicas (maximum)
    ↓
Load generator removed
    ↓
HPA can scale back toward 2 replicas
```

------------------------------------------------------------------------

## 17. Important Notes

-   Do **not** commit real production secrets or passwords to Git.
-   `backend/.env` and `backend/.env.docker` should remain ignored if
    they contain credentials.
-   The Docker database URL uses `host.docker.internal` because the
    PostgreSQL database is accessed from inside the Docker container.
-   The frontend Docker image was built with
    `NEXT_PUBLIC_API_URL=http://localhost:3001`.
-   Local Kind images were loaded directly into the Kind node instead of
    being pulled from Docker Hub.
-   Metrics Server required `--kubelet-insecure-tls` for this local
    Kind/Docker Desktop environment.
