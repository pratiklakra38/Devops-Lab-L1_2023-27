package com.shivam.retail.service;

import com.shivam.retail.model.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service class handling business logic and in-memory storage for products.
 */
@Service
public class ProductService {

    // In-memory list to store retail products
    private final List<Product> productList = new ArrayList<>();
    
    // Auto-increment ID generator
    private final AtomicLong idCounter = new AtomicLong(1);

    // Constructor initializes sample retail products
    public ProductService() {
        productList.add(new Product(idCounter.getAndIncrement(), "Wireless Mouse", "Electronics", 799.00, 25));
        productList.add(new Product(idCounter.getAndIncrement(), "Mechanical Keyboard", "Electronics", 2499.00, 15));
        productList.add(new Product(idCounter.getAndIncrement(), "Cotton T-Shirt", "Apparel", 499.00, 50));
        productList.add(new Product(idCounter.getAndIncrement(), "Stainless Steel Bottle", "Home & Kitchen", 650.00, 30));
    }

    /**
     * Retrieve all products.
     */
    public List<Product> getAllProducts() {
        return new ArrayList<>(productList);
    }

    /**
     * Retrieve a product by its ID.
     */
    public Optional<Product> getProductById(Long id) {
        return productList.stream()
                .filter(product -> product.getId().equals(id))
                .findFirst();
    }

    /**
     * Add a new product with auto-generated ID.
     */
    public Product addProduct(Product product) {
        product.setId(idCounter.getAndIncrement());
        productList.add(product);
        return product;
    }

    /**
     * Update an existing product by ID.
     */
    public Optional<Product> updateProduct(Long id, Product updatedProduct) {
        return getProductById(id).map(existingProduct -> {
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setCategory(updatedProduct.getCategory());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setQuantity(updatedProduct.getQuantity());
            return existingProduct;
        });
    }

    /**
     * Delete a product by its ID.
     */
    public boolean deleteProduct(Long id) {
        return productList.removeIf(product -> product.getId().equals(id));
    }
}
