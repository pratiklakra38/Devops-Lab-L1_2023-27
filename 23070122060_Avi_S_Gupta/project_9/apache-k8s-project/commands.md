# Kubernetes Commands & Explanations

This document contains all the necessary commands to execute, verify, scale, and troubleshoot the Apache2 deployment on Kubernetes.

## 1. Create Resources

**Command:**
```bash
kubectl apply -f apache-configmap.yaml
```
**Explanation:** This command applies the ConfigMap YAML file to create a ConfigMap named `apache-config` in the cluster. It stores the contents of the `custom-index.html` page.

**Command:**
```bash
kubectl apply -f apache-deployment.yaml
```
**Explanation:** This applies the Deployment YAML file. It creates a Deployment named `apache-deployment` with 2 replicas of the Apache (httpd:2.4) web server and mounts our ConfigMap as the `index.html`.

**Command:**
```bash
kubectl apply -f apache-service.yaml
```
**Explanation:** This creates a Service of type `NodePort` named `apache-service`. It exposes the Apache pods to be accessible outside the cluster on node port `30080`.

---

## 2. Verify Resources

**Command:**
```bash
kubectl get all
```
**Explanation:** Lists all basic resources in the default namespace, including Pods, Services, Deployments, and ReplicaSets. This gives a high-level overview of everything running.

**Command:**
```bash
kubectl get deployments
```
**Explanation:** Lists only the Deployments. You should see `apache-deployment` with 2/2 ready replicas.

**Command:**
```bash
kubectl get pods
```
**Explanation:** Lists all running Pods. You should see two pods starting with `apache-deployment-`.

**Command:**
```bash
kubectl get services
```
**Explanation:** Lists all Services. You should see `apache-service` as a NodePort mapping port 80 to 30080.

**Command:**
```bash
kubectl get configmaps
```
**Explanation:** Verifies the creation of the ConfigMap. `apache-config` should be listed here.

**Command:**
```bash
kubectl describe deployment apache-deployment
```
**Explanation:** Provides detailed information about the Deployment, including the replica count, strategy, labels, selectors, and a timeline of events (e.g., when it was scaled up).

**Command:**
```bash
kubectl describe pod <POD_NAME>
```
*(Replace `<POD_NAME>` with the actual name from `kubectl get pods`)*
**Explanation:** Shows detailed configuration of a specific Pod, including Node placement, status, IP address, mounted volumes (like our ConfigMap), and recent events.

---

## 3. Logs

**Command:**
```bash
kubectl logs <POD_NAME>
```
**Explanation:** Retrieves the current logs for the specified Apache pod. Useful to see if Apache started successfully or if there are access/error logs.

**Command:**
```bash
kubectl logs -f <POD_NAME>
```
**Explanation:** The `-f` flag "follows" the logs. It streams live log output to your terminal, which is helpful when you are actively trying to access the web server and want to see the incoming requests in real-time.

---

## 4. Execute Commands Inside Pod

**Command:**
```bash
kubectl exec -it <POD_NAME> -- /bin/bash
```
**Explanation:** Opens an interactive terminal (shell) inside the specified running pod. The `-it` flag allocates a TTY and keeps STDIN open.

*Once inside the pod, you can run the following to verify the setup:*

**Command:**
```bash
ls
```
**Explanation:** Lists the files in the current directory (default is `/usr/local/apache2/htdocs/` for httpd).

**Command:**
```bash
cat index.html
```
**Explanation:** Prints the contents of `index.html`. This should display the custom HTML from our ConfigMap.

**Command:**
```bash
apachectl -v
```
**Explanation:** Prints the version of the Apache HTTP server installed in the container, verifying that httpd is correctly installed and running.

---

## 5. Scaling

**Command:**
```bash
kubectl scale deployment apache-deployment --replicas=5
```
**Explanation:** Dynamically changes the desired number of replicas for `apache-deployment` from 2 to 5. Kubernetes will immediately start creating 3 new pods to match this desired state.

**Command to verify scaling:**
```bash
kubectl get pods -w
```
**Explanation:** Watches the pods being created in real-time until 5 pods are running.

---

## 6. Port Forwarding

**Command:**
```bash
kubectl port-forward deployment/apache-deployment 8080:80
```
**Explanation:** Forwards traffic from port `8080` on your local machine to port `80` on the Apache deployment inside the cluster.

**Workflow / How it works:**
1. You run the command in your terminal (and leave it running).
2. You open a browser and go to `http://localhost:8080`.
3. The request hits your localhost port 8080.
4. `kubectl` intercepts it and securely tunnels it to the Kubernetes API server.
5. The API server routes the traffic to port 80 of one of the Pods managed by `apache-deployment`.
6. You see your custom webpage.

---

## 7. NodePort Access

**Command to check service:**
```bash
kubectl get svc apache-service
```
**Explanation:** Confirms the NodePort is mapped (80:30080/TCP).

**Access instructions depending on your cluster environment:**

*   **Minikube:**
    ```bash
    minikube service apache-service
    ```
    *Explanation:* Minikube provides a command to automatically tunnel and open the NodePort service in your default web browser. Alternatively, you can get the Minikube IP (`minikube ip`) and visit `http://<MINIKUBE_IP>:30080`.

*   **Docker Desktop:**
    *Access:* `http://localhost:30080`
    *Explanation:* Docker Desktop automatically maps the NodePort (30080) to your host machine's localhost.

*   **Kind (Kubernetes in Docker):**
    *Explanation:* Kind clusters require extra port-mapping configuration when creating the cluster for NodePorts to be accessible on `localhost`. If the cluster wasn't created with a configuration mapping port 30080 to the host, you must use Port Forwarding (`kubectl port-forward svc/apache-service 30080:80`) instead to access it from the host machine.

---

## 8. Troubleshooting Commands

**Command:**
```bash
kubectl describe pod <POD_NAME>
```
**Explanation:** The first stop for troubleshooting a failing pod. Check the "Events" section at the bottom for errors like `CrashLoopBackOff`, `ImagePullBackOff`, or scheduling issues.

**Command:**
```bash
kubectl logs <POD_NAME>
```
**Explanation:** Shows the application-level logs. If Apache fails to start due to a bad configuration file, the error will be printed here.

**Command:**
```bash
kubectl get events --sort-by='.metadata.creationTimestamp'
```
**Explanation:** Lists all recent events across the cluster (or namespace), sorted chronologically. This is excellent for diagnosing issues where pods are repeatedly crashing or failing to schedule, giving a broad view of cluster health.

**Command:**
```bash
kubectl top pods
```
**Explanation:** Displays the CPU and Memory usage of all pods. Useful if you suspect a pod is crashing due to Out Of Memory (OOM) errors or consuming too much CPU. *(Note: Requires Metrics Server to be installed in the cluster).*

**Command:**
```bash
kubectl top nodes
```
**Explanation:** Displays the CPU and Memory usage of the underlying cluster nodes. Useful to determine if the cluster itself is out of resources, preventing new pods from being scheduled.
