package com.retail.system.controller;

import com.retail.system.repository.CustomerRepository;
import com.retail.system.repository.OrderRepository;
import com.retail.system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("totalProducts", productRepository.count());
        model.addAttribute("totalOrders", orderRepository.count());
        model.addAttribute("totalCustomers", customerRepository.count());
        // For revenue, we could sum the totalAmount of delivered orders
        // For simplicity, we just pass 0 or calculate it
        model.addAttribute("revenue", "0.00");
        return "dashboard";
    }
}
