\# Project 6 - Kubernetes Deployment



\## Objective

Deploy and manage a containerized application using Kubernetes.



\## Kubernetes Resources

\- Deployment: `social-media-app`

\- Service: `social-media-service`

\- Service Type: `NodePort`

\- Container Image: `nginx:latest`

\- Container Port: `80`

\- Initial Replicas: `1`

\- Scaled Replicas: `3`



\## Operations Performed

\- Created Kubernetes Deployment and Service

\- Verified Pods and Services

\- Scaled Deployment from 1 to 3 replicas

\- Performed rolling update

\- Verified rollout status and rollout history

\- Performed rollback

\- Configured Horizontal Pod Autoscaler (HPA)

\- Configured Metrics Server

\- Verified CPU and memory metrics using `kubectl top pods`

\- Verified HPA CPU-based scaling



\## HPA Configuration

\- Minimum replicas: `1`

\- Maximum replicas: `5`

\- Target CPU utilization: `50%`



\## Application Access

The application was accessed using Kubernetes port forwarding.



\## Screenshots

The `screenshots` directory contains evidence of the Kubernetes configuration, deployment, scaling, rollout, rollback, and HPA operations.

