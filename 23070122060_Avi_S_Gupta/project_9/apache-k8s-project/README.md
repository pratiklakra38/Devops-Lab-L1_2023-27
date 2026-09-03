# Kubernetes Apache2 Deployment Project

## Student Details
- **Name:** Avi S Gupta
- **PRN:** 23070122060
- **Course:** DevOps Lab L1 (2023–27)

## Aim
To understand and implement the core concepts of Kubernetes by deploying a containerized Apache2 web server, injecting custom configuration, and exposing it to external networks.

## Objective
The objective of this assignment is to:
1. Create a **Kubernetes Deployment** to manage Apache2 web server Pods.
2. Utilize a **ConfigMap** to inject a custom `index.html` web page into the containers.
3. Expose the web server to the host machine using a **NodePort Service**.
4. Learn to access, scale, log, and troubleshoot applications running on a Kubernetes cluster.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
*   [Docker](https://docs.docker.com/get-docker/)
*   A local Kubernetes cluster environment: [Minikube](https://minikube.sigs.k8s.io/docs/start/), [Docker Desktop Kubernetes](https://docs.docker.com/desktop/kubernetes/), or [Kind](https://kind.sigs.k8s.io/).
*   [kubectl](https://kubernetes.io/docs/tasks/tools/) command-line tool configured to communicate with your cluster.

## Installation / Setup

1. **Start your Kubernetes Cluster:**
   *   *Minikube:* `minikube start`
   *   *Docker Desktop:* Enable Kubernetes in the Docker Desktop settings.
   *   *Kind:* `kind create cluster`

2. **Clone/Navigate to the project directory:**
   Ensure you are in the `apache-k8s-project` directory containing all the `.yaml` files.

## Deployment Steps

Execute the following commands in order to deploy the infrastructure:

1. **Create the ConfigMap (Custom Webpage):**
   ```bash
   kubectl apply -f apache-configmap.yaml
   ```
   *Purpose:* Creates a ConfigMap named `apache-config` containing the `index.html` content.

2. **Create the Deployment (Apache Server):**
   ```bash
   kubectl apply -f apache-deployment.yaml
   ```
   *Purpose:* Deploys 2 replicas of the `httpd:2.4` image and mounts the ConfigMap into the container's web directory.

3. **Create the Service (Network Access):**
   ```bash
   kubectl apply -f apache-service.yaml
   ```
   *Purpose:* Exposes the deployment on `NodePort 30080`, allowing external access.

## Verification Steps

Verify that all components are running smoothly:

1. **Check all resources:**
   ```bash
   kubectl get all
   ```
2. **Verify Pod status:**
   ```bash
   kubectl get pods
   ```
   *(Ensure STATUS is "Running" and READY is "1/1")*
3. **Verify ConfigMap:**
   ```bash
   kubectl describe configmap apache-config
   ```

## Accessing Apache from Host Machine

You can access the web server using two different methods:

### Method 1: NodePort (Recommended for Assignment)
*   **Docker Desktop:** Open your browser and go to `http://localhost:30080`
*   **Minikube:** Run the command `minikube service apache-service`. This will automatically open a tunnel and launch your browser. (Alternatively, find the IP via `minikube ip` and visit `http://<MINIKUBE-IP>:30080`).

### Method 2: Port Forwarding
If NodePort is blocked or you are using Kind without port mapping, use Port Forwarding:
```bash
kubectl port-forward deployment/apache-deployment 8080:80
```
Then open your browser and go to `http://localhost:8080`.

## Architecture Overview
*   **Host Machine:** Initiates HTTP request.
*   **Service (NodePort 30080):** Receives request and load-balances across pods.
*   **Deployment (2 Replicas):** Manages the Pods ensuring high availability.
*   **Pod (Apache HTTPD):** Runs the container on port 80.
*   **ConfigMap:** Mounted inside the pod at `/usr/local/apache2/htdocs/index.html` overriding the default Apache page.

*(See `architecture.md` for a detailed visual diagram).*

## Screenshots Section
*(Students: Add your screenshots below this line)*
1. Screenshot of `kubectl get all` showing running resources.
2. Screenshot of the web browser displaying the custom "Kubernetes Apache Server Successfully Running" page.
3. Screenshot of `kubectl scale deployment` command.
4. Screenshot of accessing logs using `kubectl logs`.

## Learning Outcomes
By completing this assignment, you will have successfully demonstrated the ability to:
*   Write declarative YAML files for Kubernetes resources.
*   Decouple configuration artifacts from image content using ConfigMaps.
*   Expose cluster-internal deployments to the external host network.
*   Scale and manage container lifecycles declaratively.
*   Utilize CLI commands for active debugging and troubleshooting.

## Viva Questions & Answers

### Pods & Containers
1. **Q: What is a Pod in Kubernetes?**
   **A:** A Pod is the smallest, most basic deployable object in Kubernetes. It represents a single instance of a running process in your cluster and can contain one or more containers that share network and storage resources.

2. **Q: Why are we deploying Apache inside a Pod instead of directly on a VM?**
   **A:** Deploying in a Pod ensures containerization benefits: portability, consistency across environments, rapid scaling, and isolation. Kubernetes manages the Pod's lifecycle, restarting it if it fails.

3. **Q: How did you verify what is inside the Apache container?**
   **A:** By using `kubectl exec -it <POD_NAME> -- /bin/bash`, which opens an interactive shell inside the running container, allowing us to run commands like `ls` and `cat index.html`.

4. **Q: What Docker image did we use for the web server and why?**
   **A:** We used `httpd:2.4`. It is the official, lightweight Docker image for the Apache HTTP Server.

5. **Q: What happens if a container inside the Pod crashes?**
   **A:** Kubernetes (specifically the kubelet on the node) will automatically restart the container based on the Pod's `restartPolicy` (which defaults to Always).

### Deployments & ReplicaSets
6. **Q: What is the primary purpose of a Deployment?**
   **A:** A Deployment provides declarative updates for Pods and ReplicaSets. It allows you to describe the desired state (e.g., "I want 2 replicas of Apache"), and the Deployment Controller changes the actual state to the desired state at a controlled rate.

7. **Q: How does a Deployment relate to a ReplicaSet?**
   **A:** A Deployment manages a ReplicaSet underneath. When you create a Deployment, it creates a ReplicaSet, which in turn manages the Pods. If you update the Deployment (like changing the image), it creates a new ReplicaSet and scales the old one down.

8. **Q: What does `replicas: 2` mean in our `apache-deployment.yaml`?**
   **A:** It means the cluster must ensure that exactly 2 instances (Pods) of the Apache web server are running at all times for high availability and load balancing.

9. **Q: How do you scale the Apache server to handle more traffic?**
   **A:** By using the command `kubectl scale deployment apache-deployment --replicas=5`, or by editing the YAML file and re-applying it.

10. **Q: What happens if you manually delete one of the running Apache Pods?**
    **A:** The ReplicaSet managed by the Deployment will immediately detect that the current state (1 pod) doesn't match the desired state (2 pods) and will create a new Pod to replace the deleted one.

### Services & Networking
11. **Q: What is a Kubernetes Service?**
    **A:** A Service is an abstraction that defines a logical set of Pods and a policy by which to access them. It provides a stable IP address and DNS name, acting as a load balancer for the Pods.

12. **Q: Why do we need a Service? Can't we just use the Pod's IP address?**
    **A:** Pods are ephemeral; they are created and destroyed frequently, causing their IP addresses to change. A Service provides a persistent IP and DNS name that routes traffic to the dynamic Pods.

13. **Q: What is a NodePort Service?**
    **A:** A NodePort service opens a specific port on every Node's IP in the cluster. It routes traffic from that NodePort to the target port on the Pods.

14. **Q: What port range is allowed for NodePorts by default?**
    **A:** The default range is 30000-32767. (We used 30080 in this assignment).

15. **Q: What is the difference between `port`, `targetPort`, and `nodePort`?**
    **A:** `port` is the port exposed by the Service internally. `targetPort` is the port the container is listening on (e.g., 80 for Apache). `nodePort` is the port exposed externally on the host machine/node.

16. **Q: How does the Service know which Pods to route traffic to?**
    **A:** Services use `selectors`. In our YAML, the service looks for Pods with the label `app: apache-server`.

### ConfigMaps & Volumes
17. **Q: What is a ConfigMap?**
    **A:** A ConfigMap is an API object used to store non-confidential data in key-value pairs. It allows you to decouple environment-specific configuration from your container images.

18. **Q: Why didn't we just build a custom Docker image with the `index.html` inside it?**
    **A:** Using a ConfigMap is faster and more flexible for configuration changes. We don't have to rebuild and push a new Docker image every time we want to change a typo in the HTML file; we just update the ConfigMap.

19. **Q: How is the ConfigMap injected into the Apache container?**
    **A:** It is injected using a `volume`. We define a volume pointing to the ConfigMap in the Pod spec, and then use `volumeMounts` to mount that volume at a specific path (`/usr/local/apache2/htdocs/`) inside the container.

20. **Q: What is the purpose of `subPath` in the volume mount?**
    **A:** By default, mounting a volume overrides the entire directory. Using `subPath: index.html` ensures we only overwrite that specific file, leaving other files in the `htdocs` directory intact.

### Troubleshooting & CLI
21. **Q: You ran `kubectl apply`, but the Pod status is `ImagePullBackOff`. What does this mean?**
    **A:** It means the node's container runtime is unable to pull the Docker image specified in the YAML. This is usually due to a typo in the image name, a missing tag, or network issues.

22. **Q: How do you view the actual HTTP requests hitting your Apache server?**
    **A:** By checking the container logs using the command `kubectl logs <POD_NAME>`.

23. **Q: What does the `-f` flag do in `kubectl logs -f`?**
    **A:** It streams or "follows" the logs in real-time, rather than just printing the past logs and exiting.

24. **Q: What command gives you a chronological list of everything happening in the cluster to help debug scheduling issues?**
    **A:** `kubectl get events`

25. **Q: If a Pod is crashing repeatedly, which command is best to find out *why* it crashed initially?**
    **A:** `kubectl describe pod <POD_NAME>` and look at the "Events" section, or `kubectl logs --previous <POD_NAME>` to see logs from the previously crashed container instance.

### Port Forwarding
26. **Q: What is port forwarding (`kubectl port-forward`)?**
    **A:** It is a secure tunnel created by the kubectl tool that forwards a port on your local machine directly to a port on a Pod or Service inside the Kubernetes cluster.

27. **Q: Is Port Forwarding a production-ready way to expose traffic?**
    **A:** No. Port forwarding is purely for local debugging, testing, and troubleshooting. For production, Services (like LoadBalancer) or Ingress controllers are used.

28. **Q: What is the difference between accessing via NodePort and via Port-Forwarding?**
    **A:** NodePort is an actual network rule created on the cluster nodes to route external traffic in. Port-forwarding is an active, temporary proxy session maintained by your terminal.

### General Concepts
29. **Q: What is the purpose of `labels` in Kubernetes?**
    **A:** Labels are key/value pairs attached to objects (like Pods). They are used to organize and select subsets of objects. For example, our Service uses labels to find the right Pods to send traffic to.

30. **Q: How does Kubernetes achieve High Availability in this project?**
    **A:** Through the Deployment ensuring 2 replicas are running, and the Service load-balancing traffic between them. If one Pod goes down, traffic is routed to the other, and the Deployment immediately spins up a replacement.

## Conclusion
This project successfully demonstrates the deployment of a containerized Apache server on Kubernetes. By utilizing Deployments, ConfigMaps, and Services, we have created a scalable, decoupled, and highly available web server infrastructure accessible from the local host machine.
