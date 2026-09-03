import os

base_dir = "."

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content.strip() + "\n")

# --- Kubernetes Manifests ---
k8s_dir = os.path.join(base_dir, "kubernetes")

k8s_files = {
    "namespace.yaml": """
apiVersion: v1
kind: Namespace
metadata:
  name: microservice-app
    """,
    "configmap.yaml": """
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: microservice-app
data:
  MONGO_HOST: "mongodb-service"
  MONGO_PORT: "27017"
  USER_SERVICE_URL: "http://user-service:8081"
  PRODUCT_SERVICE_URL: "http://product-service:8082"
  ORDER_SERVICE_URL: "http://order-service:8083"
  NOTIFICATION_SERVICE_URL: "http://notification-service:8084"
  REACT_APP_API_URL: "/api"
    """,
    "secret.yaml": """
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: microservice-app
type: Opaque
data:
  # admin / password / my-super-secret-jwt-key
  MONGO_USERNAME: YWRtaW4=
  MONGO_PASSWORD: cGFzc3dvcmQ=
  JWT_SECRET: bXktc3VwZXItc2VjcmV0LWp3dC1rZXk=
    """,
    "mongodb-deployment.yaml": """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: microservice-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:6.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: MONGO_USERNAME
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: MONGO_PASSWORD
        volumeMounts:
        - name: mongo-data
          mountPath: /data/db
      volumes:
      - name: mongo-data
        persistentVolumeClaim:
          claimName: mongo-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongo-pvc
  namespace: microservice-app
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
    """,
    "mongodb-service.yaml": """
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
  namespace: microservice-app
spec:
  selector:
    app: mongodb
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
  clusterIP: None
    """
}

def get_service_yaml(name, port):
    return f"""
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}
  namespace: microservice-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: {name}
  template:
    metadata:
      labels:
        app: {name}
    spec:
      containers:
      - name: {name}
        image: {name}:latest
        imagePullPolicy: Never
        ports:
        - containerPort: {port}
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        env:
        - name: SPRING_DATA_MONGODB_URI
          value: "mongodb://$(MONGO_USERNAME):$(MONGO_PASSWORD)@$(MONGO_HOST):$(MONGO_PORT)/{name.replace('-', '')}?authSource=admin"
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: {port}
          initialDelaySeconds: 20
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: {port}
          initialDelaySeconds: 30
          periodSeconds: 15
---
apiVersion: v1
kind: Service
metadata:
  name: {name}
  namespace: microservice-app
spec:
  type: ClusterIP
  selector:
    app: {name}
  ports:
    - protocol: TCP
      port: {port}
      targetPort: {port}
    """

k8s_files["user-deployment.yaml"] = get_service_yaml("user-service", 8081)
k8s_files["product-deployment.yaml"] = get_service_yaml("product-service", 8082)
k8s_files["order-deployment.yaml"] = get_service_yaml("order-service", 8083)
k8s_files["notification-deployment.yaml"] = get_service_yaml("notification-service", 8084)

k8s_files["frontend-deployment.yaml"] = """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: microservice-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: frontend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: app-config
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: microservice-app
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
"""

k8s_files["ingress.yaml"] = """
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: microservice-app
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /api/users(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 8081
      - path: /api/products(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: product-service
            port:
              number: 8082
      - path: /api/orders(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 8083
      - path: /api/notifications(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: notification-service
            port:
              number: 8084
      - path: /()(.*)
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
"""

for fname, content in k8s_files.items():
    write_file(os.path.join(k8s_dir, fname), content)


# --- Spring Boot Boilerplate ---
def get_pom_xml(service_name):
    return f"""
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>{service_name}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>{service_name}</name>
    <description>{service_name} for microservices project</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
"""

def get_dockerfile(port):
    return f"""
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE {port}
ENTRYPOINT ["java", "-jar", "app.jar"]
"""

services = {
    "user-service": {
        "port": 8081,
        "package": "com.example.userservice",
        "entity": """
package com.example.userservice.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String name;
}
        """,
        "dto": """
package com.example.userservice.dto;
import lombok.Data;
@Data
public class UserDTO {
    private String username;
    private String email;
    private String name;
}
        """,
        "repository": """
package com.example.userservice.repository;
import com.example.userservice.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface UserRepository extends MongoRepository<User, String> {
}
        """,
        "service": """
package com.example.userservice.service;
import com.example.userservice.entity.User;
import com.example.userservice.dto.UserDTO;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getName());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }
}
        """,
        "controller": """
package com.example.userservice.controller;
import com.example.userservice.entity.User;
import com.example.userservice.dto.UserDTO;
import com.example.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public User createUser(@RequestBody UserDTO userDTO) {
        return userService.createUser(userDTO);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }
}
        """
    },
    "product-service": {
        "port": 8082,
        "package": "com.example.productservice",
        "entity": """
package com.example.productservice.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private int stock;
}
        """,
        "dto": """
package com.example.productservice.dto;
import lombok.Data;
@Data
public class ProductDTO {
    private String name;
    private String description;
    private double price;
    private int stock;
}
        """,
        "repository": """
package com.example.productservice.repository;
import com.example.productservice.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface ProductRepository extends MongoRepository<Product, String> {
}
        """,
        "service": """
package com.example.productservice.service;
import com.example.productservice.entity.Product;
import com.example.productservice.dto.ProductDTO;
import com.example.productservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null);
    }
}
        """,
        "controller": """
package com.example.productservice.controller;
import com.example.productservice.entity.Product;
import com.example.productservice.dto.ProductDTO;
import com.example.productservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public Product createProduct(@RequestBody ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }
}
        """
    },
    "order-service": {
        "port": 8083,
        "package": "com.example.orderservice",
        "entity": """
package com.example.orderservice.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private String productId;
    private int quantity;
    private double totalPrice;
    private Date orderDate;
    private String status;
}
        """,
        "dto": """
package com.example.orderservice.dto;
import lombok.Data;
@Data
public class OrderDTO {
    private String userId;
    private String productId;
    private int quantity;
}
        """,
        "repository": """
package com.example.orderservice.repository;
import com.example.orderservice.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface OrderRepository extends MongoRepository<Order, String> {
}
        """,
        "service": """
package com.example.orderservice.service;
import com.example.orderservice.entity.Order;
import com.example.orderservice.dto.OrderDTO;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Date;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${user.service.url}")
    private String userServiceUrl;

    @Value("${product.service.url}")
    private String productServiceUrl;
    
    @Value("${notification.service.url}")
    private String notificationServiceUrl;

    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setUserId(orderDTO.getUserId());
        order.setProductId(orderDTO.getProductId());
        order.setQuantity(orderDTO.getQuantity());
        order.setOrderDate(new Date());
        order.setStatus("CREATED");
        
        try {
            restTemplate.getForObject(userServiceUrl + "/" + orderDTO.getUserId(), String.class);
            restTemplate.getForObject(productServiceUrl + "/" + orderDTO.getProductId(), String.class);
            order.setTotalPrice(orderDTO.getQuantity() * 10.0);
            
            restTemplate.postForObject(notificationServiceUrl + "/notify", "Order created for user " + orderDTO.getUserId(), String.class);
        } catch (Exception e) {
            order.setStatus("FAILED: " + e.getMessage());
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
        """,
        "controller": """
package com.example.orderservice.controller;
import com.example.orderservice.entity.Order;
import com.example.orderservice.dto.OrderDTO;
import com.example.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody OrderDTO orderDTO) {
        return orderService.createOrder(orderDTO);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}
        """,
        "config": """
package com.example.orderservice.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
        """
    },
    "notification-service": {
        "port": 8084,
        "package": "com.example.notificationservice",
        "entity": """
package com.example.notificationservice.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String message;
    private Date sentAt;
}
        """,
        "dto": """
package com.example.notificationservice.dto;
import lombok.Data;
@Data
public class NotificationDTO {
    private String message;
}
        """,
        "repository": """
package com.example.notificationservice.repository;
import com.example.notificationservice.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface NotificationRepository extends MongoRepository<Notification, String> {
}
        """,
        "service": """
package com.example.notificationservice.service;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Date;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setSentAt(new Date());
        System.out.println("Sending notification: " + message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
        """,
        "controller": """
package com.example.notificationservice.controller;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/notify")
    public Notification notify(@RequestBody String message) {
        return notificationService.sendNotification(message);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
}
        """
    }
}

for svc_name, svc_data in services.items():
    svc_dir = os.path.join(base_dir, svc_name)
    write_file(os.path.join(svc_dir, "pom.xml"), get_pom_xml(svc_name))
    write_file(os.path.join(svc_dir, "Dockerfile"), get_dockerfile(svc_data["port"]))
    
    props = f"""
server.port={svc_data["port"]}
spring.data.mongodb.uri=${{SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/{svc_name.replace('-', '')}}}
management.endpoints.web.exposure.include=health
management.endpoint.health.probes.enabled=true
    """
    
    if svc_name == "order-service":
        props += """
user.service.url=${USER_SERVICE_URL:http://localhost:8081}
product.service.url=${PRODUCT_SERVICE_URL:http://localhost:8082}
notification.service.url=${NOTIFICATION_SERVICE_URL:http://localhost:8084}
        """
    write_file(os.path.join(svc_dir, "src", "main", "resources", "application.properties"), props)
    
    pkg_path = os.path.join(svc_dir, "src", "main", "java", *svc_data["package"].split("."))
    
    app_class = f"""
package {svc_data["package"]};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {{
    public static void main(String[] args) {{
        SpringApplication.run(Application.class, args);
    }}
}}
    """
    write_file(os.path.join(pkg_path, "Application.java"), app_class)
    
    write_file(os.path.join(pkg_path, "entity", svc_name.split("-")[0].capitalize() + ".java"), svc_data["entity"])
    write_file(os.path.join(pkg_path, "dto", svc_name.split("-")[0].capitalize() + "DTO.java"), svc_data["dto"])
    write_file(os.path.join(pkg_path, "repository", svc_name.split("-")[0].capitalize() + "Repository.java"), svc_data["repository"])
    write_file(os.path.join(pkg_path, "service", svc_name.split("-")[0].capitalize() + "Service.java"), svc_data["service"])
    write_file(os.path.join(pkg_path, "controller", svc_name.split("-")[0].capitalize() + "Controller.java"), svc_data["controller"])
    
    if "config" in svc_data:
        write_file(os.path.join(pkg_path, "config", "AppConfig.java"), svc_data["config"])

print("Backend and Kubernetes generated successfully.")
