package retail_app;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RetailController {

    @GetMapping("/products")
    public List<Product> getProducts() {
        return List.of(
            new Product("Laptop", 899.99),
            new Product("Smartphone", 499.99),
            new Product("Headphones", 129.50),
            new Product("Coffee Maker", 79.00)
        );
    }
}
