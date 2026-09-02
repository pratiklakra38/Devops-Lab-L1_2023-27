package com.shivam.retail.service;

import com.shivam.retail.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class ProductServiceTest {

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService();
    }

    @Test
    void testGetAllProducts() {
        List<Product> products = productService.getAllProducts();
        assertNotNull(products);
        assertTrue(products.size() >= 4);
    }

    @Test
    void testGetProductById() {
        Optional<Product> product = productService.getProductById(1L);
        assertTrue(product.isPresent());
        assertEquals("Wireless Mouse", product.get().getName());
    }

    @Test
    void testAddProduct() {
        Product newProduct = new Product(null, "Gaming Headset", "Electronics", 1899.00, 10);
        Product savedProduct = productService.addProduct(newProduct);
        assertNotNull(savedProduct.getId());
        assertEquals("Gaming Headset", savedProduct.getName());
    }

    @Test
    void testUpdateProduct() {
        Product updateInfo = new Product(null, "Wireless Mouse Pro", "Electronics", 999.00, 30);
        Optional<Product> updated = productService.updateProduct(1L, updateInfo);
        assertTrue(updated.isPresent());
        assertEquals("Wireless Mouse Pro", updated.get().getName());
        assertEquals(999.00, updated.get().getPrice());
    }

    @Test
    void testDeleteProduct() {
        boolean deleted = productService.deleteProduct(1L);
        assertTrue(deleted);
        Optional<Product> deletedProduct = productService.getProductById(1L);
        assertFalse(deletedProduct.isPresent());
    }
}
