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
