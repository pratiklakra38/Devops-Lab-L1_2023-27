package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

/**
 * Unit tests for the portfolio application.
 */
public class AppTest {

    @Test
    public void testName() {
        assertEquals("Dhruv Gangurde", App.getName());
    }

    @Test
    public void testRole() {
        assertEquals("Computer Science Student", App.getRole());
    }

    @Test
    public void testProjectCount() {
        assertEquals(4, App.getProjectCount());
    }
}