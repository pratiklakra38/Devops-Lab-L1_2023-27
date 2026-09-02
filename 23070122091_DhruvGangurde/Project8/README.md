\# Project 8 – Kubernetes Microservices Application



\## Objective



Create and deploy a complete containerized application using Kubernetes with at least four microservices. The project demonstrates Kubernetes Deployments, Services, ConfigMaps, and Secrets.



\## Architecture



The application consists of four microservices:



\- Frontend Service

\- User Service

\- Product Service

\- Order Service



Each microservice runs as a Kubernetes Deployment and is exposed internally through a Kubernetes Service.



\## Kubernetes Components



\### Deployments



Four Deployments were created:



\- `frontend`

\- `user-service`

\- `product-service`

\- `order-service`



Each Deployment runs one replica using the `nginx:alpine` container image.



\### Services



Four Kubernetes Services were created:



\- `frontend-service` – NodePort

\- `user-service` – ClusterIP

\- `product-service` – ClusterIP

\- `order-service` – ClusterIP



The frontend is exposed using NodePort `30081`, while the other services communicate internally using Kubernetes DNS.



\### ConfigMap



The `app-config` ConfigMap stores non-sensitive configuration:



\- `APP\_ENV`

\- `APP\_NAME`



\### Secret



The `app-secret` Secret stores sensitive configuration:



\- `DB\_USERNAME`

\- `DB\_PASSWORD`



The Secret is injected into the required microservices as environment variables.



\## Verification



All four microservices were successfully deployed and reached the `Running` state.



Internal service communication was tested using Kubernetes service names:



```text

frontend-service

user-service

product-service

order-service

