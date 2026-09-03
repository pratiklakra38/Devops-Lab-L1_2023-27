# Project 6: Kubernetes Horizontal Pod Autoscaling

## Student Details
- **Name:** Avi S Gupta
- **PRN:** 23070122060
- **Course:** DevOps Lab L1 (2023–27)

This project demonstrates application scalability using Kubernetes Horizontal Pod Autoscaling (HPA). It deploys a simple application, exposes it through a Service, generates traffic, and shows Kubernetes increasing or decreasing the number of Pods based on CPU usage.

## Project Flow

```text
User
  |
  v
Kubernetes Service
  |
  v
Deployment
  |
  v
Pods
  |
  v
HPA monitors CPU
  |
  v
More Pods are created automatically when CPU increases
```

## Files

```text
deployment.yaml  - Creates the application Deployment with 2 initial replicas
service.yaml     - Exposes the application inside the Kubernetes cluster
hpa.yaml         - Configures automatic scaling from 2 to 10 Pods
load-test.yaml   - Starts a BusyBox load generator to send traffic
```

## Prerequisites

Enable Kubernetes in Docker Desktop:

```bash
Docker Desktop -> Settings -> Kubernetes -> Enable Kubernetes
```

Verify Kubernetes is running:

```bash
kubectl version --client
kubectl get nodes
```

If `kubectl get nodes` shows a Jenkins or Hudson authentication error, Kubernetes is not selected as the active `kubectl` context. This usually happens when Docker Desktop Kubernetes is not enabled yet, so `kubectl` tries `localhost:8080`, where Jenkins may be running.

Fix it with:

```bash
kubectl config get-contexts
kubectl config use-context docker-desktop
kubectl get nodes
```

If `docker-desktop` is not listed, open Docker Desktop and enable Kubernetes first. After it finishes starting, run the commands again.

HPA requires the Metrics Server. Check metrics with:

```bash
kubectl top nodes
kubectl top pods
```

If these commands show CPU and memory usage, the cluster is ready for HPA.

## Deploy the Application

Apply the Kubernetes manifests:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml
```

Check the resources:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get hpa
```

At the beginning, the Deployment should have 2 replicas because `minReplicas` is set to 2.

## Generate Load

Start the load generator:

```bash
kubectl apply -f load-test.yaml
```

Watch autoscaling:

```bash
kubectl get hpa -w
```

In another terminal, watch the Pods:

```bash
kubectl get pods -w
```

When CPU usage increases, Kubernetes can automatically create more Pods up to the configured maximum of 10.

## Stop the Load

Delete the load generator:

```bash
kubectl delete -f load-test.yaml
```

Then watch the HPA again:

```bash
kubectl get hpa -w
```

After CPU usage falls, Kubernetes should scale the application back toward 2 Pods.

## Screenshot Checklist

Capture these command outputs for the practical:

```bash
kubectl get nodes
kubectl get deployments
kubectl get pods
kubectl get service
kubectl get hpa
kubectl top pods
kubectl apply -f load-test.yaml
kubectl get hpa -w
kubectl get pods -w
kubectl delete -f load-test.yaml
kubectl get hpa
```

## Explanation

I created a Kubernetes Deployment for the application, exposed it using a Kubernetes Service, and configured a Horizontal Pod Autoscaler. The HPA monitors CPU utilization and automatically increases the number of application Pods when the workload increases. When the workload decreases, Kubernetes scales the Pods back toward the minimum replica count.
