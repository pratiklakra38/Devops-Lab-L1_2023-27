package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class CalculatorTest {

    private final Calculator calculator = new Calculator();

    @Test
    void shouldAddTwoNumbers() {
        assertEquals(10, calculator.add(4, 6));
    }

    @Test
    void shouldSubtractTwoNumbers() {
        assertEquals(3, calculator.subtract(9, 6));
    }

    @Test
    void shouldMultiplyTwoNumbers() {
        assertEquals(24, calculator.multiply(6, 4));
    }

    @Test
    void shouldDivideTwoNumbers() {
        assertEquals(5, calculator.divide(20, 4));
    }

    @Test
    void shouldThrowWhenDividingByZero() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> calculator.divide(10, 0)
        );
        assertEquals("Divisor cannot be zero", exception.getMessage());
    }
}
