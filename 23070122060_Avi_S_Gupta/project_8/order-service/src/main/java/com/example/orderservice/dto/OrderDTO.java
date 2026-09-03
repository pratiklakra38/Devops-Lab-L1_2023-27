package com.example.orderservice.dto;
import lombok.Data;
@Data
public class OrderDTO {
    private String userId;
    private String productId;
    private int quantity;
}
