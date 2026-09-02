\# Project 7 – MongoDB and Mongo Express on Kubernetes



\## Objective



Deploy MongoDB and Mongo Express on Kubernetes using Deployments, Services, ConfigMap, and Secret.



\## Kubernetes Resources



\* \*\*MongoDB Deployment\*\* – Runs the MongoDB database.

\* \*\*MongoDB Service\*\* – Provides internal access to MongoDB.

\* \*\*Mongo Express Deployment\*\* – Runs the Mongo Express web interface.

\* \*\*Mongo Express Service\*\* – Exposes Mongo Express through a NodePort.

\* \*\*ConfigMap\*\* – Stores the MongoDB service hostname.

\* \*\*Secret\*\* – Stores MongoDB username and password securely.



\## Files



| File                            | Purpose                          |

| ------------------------------- | -------------------------------- |

| `mongo-configmap.yaml`          | MongoDB connection configuration |

| `mongo-secret.yaml`             | MongoDB credentials              |

| `mongo-deployment.yaml`         | MongoDB Deployment               |

| `mongo-service.yaml`            | MongoDB Service                  |

| `mongo-express-deployment.yaml` | Mongo Express Deployment         |

| `mongo-express-service.yaml`    | Mongo Express NodePort Service   |



\## Architecture



```text

&#x20;                ┌──────────────────────┐

&#x20;                │    Mongo Express     │

&#x20;                │       :8081          │

&#x20;                └──────────┬───────────┘

&#x20;                           │

&#x20;                    mongo-service

&#x20;                           │

&#x20;                ┌──────────▼───────────┐

&#x20;                │       MongoDB        │

&#x20;                │       :27017         │

&#x20;                └──────────────────────┘



&#x20;       ConfigMap → MongoDB Service Name

&#x20;       Secret    → MongoDB Username/Password

```



\## Technologies Used



\* Kubernetes

\* Docker

\* MongoDB

\* Mongo Express

\* YAML

\* ConfigMap

\* Kubernetes Secret

\* Deployment

\* Service

\* NodePort



\## Expected Result



MongoDB runs inside the Kubernetes cluster and Mongo Express connects to MongoDB using the Kubernetes Service name. Mongo Express is exposed externally using a NodePort.



\## Author



Dhruv Gangurde



