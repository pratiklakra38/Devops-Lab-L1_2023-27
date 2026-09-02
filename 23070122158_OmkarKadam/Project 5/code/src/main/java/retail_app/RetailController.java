package retail_app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RetailController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Retail Store!";
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return List.of(
            new Product(1, "Laptop", 59999),
            new Product(2, "Headphones", 2999),
            new Product(3, "Keyboard", 1499)
        );
    }
}