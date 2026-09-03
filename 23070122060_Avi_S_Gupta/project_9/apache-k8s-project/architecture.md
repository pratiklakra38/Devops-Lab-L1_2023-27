# Architecture Diagram: Kubernetes Apache2 Deployment

The following diagram illustrates how the host machine communicates with the Apache web server deployed inside the Kubernetes cluster.

```text
=============================================================================
                          HOST MACHINE (Your Laptop/PC)
=============================================================================
                                      |
                                      | Web Request
                       http://localhost:30080  (Docker Desktop)
                       http://<minikube-ip>:30080 (Minikube)
                                      |
=============================================================================
                           KUBERNETES CLUSTER (Node)
=============================================================================
                                      |
                                      v
+---------------------------------------------------------------------------+
|                          Service: apache-service                          |
|                          (Type: NodePort)                                 |
|                                                                           |
|   Receives traffic on NodePort 30080 and routes to TargetPort 80          |
+---------------------------------------------------------------------------+
                                      |
                                      | Routes traffic based on Selectors
                                      | (app: apache-server)
                                      v
+---------------------------------------------------------------------------+
|                       Deployment: apache-deployment                       |
|                       (Desired State: 2 Replicas)                         |
|                                                                           |
| +-------------------------+                   +-------------------------+ |
| |       Pod 1 (Active)    |   Load Balanced   |       Pod 2 (Active)    | |
| |                         | <---------------> |                         | |
| | +---------------------+ |                   | +---------------------+ | |
| | | Container:          | |                   | | Container:          | | |
| | | apache-server       | |                   | | apache-server       | | |
| | | (httpd:2.4)         | |                   | | (httpd:2.4)         | | |
| | | Port: 80            | |                   | | Port: 80            | | |
| | +----------^----------+ |                   | +----------^----------+ | |
| |            |            |                   |            |            | |
| +------------|------------+                   +------------|------------+ |
+--------------|---------------------------------------------|--------------+
               |                                             |
               | Mounts volume                               | Mounts volume
               v                                             v
+---------------------------------------------------------------------------+
|                         ConfigMap: apache-config                          |
|                                                                           |
|   Stores: index.html (Custom HTML Code)                                   |
|   Mounted at: /usr/local/apache2/htdocs/index.html                        |
+---------------------------------------------------------------------------+
```

## Architecture Explanation

1. **Host Machine Browser:** The user initiates a request from their local browser targeting port `30080` (or `8080` if using Port Forwarding).
2. **NodePort Service:** The Kubernetes Service (`apache-service`) listens on port `30080` on all cluster nodes. When traffic arrives, it routes it to `targetPort: 80`.
3. **Deployment / Pods:** The traffic is load-balanced across the 2 available Pods managed by `apache-deployment`.
4. **Apache Container:** Inside the selected Pod, the `apache-server` container (running `httpd:2.4`) receives the request on port `80`.
5. **ConfigMap (Volume Mount):** The Apache server looks for `index.html` to serve. Because we used a `volumeMount`, Kubernetes has injected the data from `apache-config` (our ConfigMap) directly into the container's file system at `/usr/local/apache2/htdocs/index.html`.
6. **Response:** The Apache server returns the custom HTML page back through the Service to the Host Machine.
