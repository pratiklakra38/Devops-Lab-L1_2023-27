package com.example;

/**
 * Simple portfolio application used for the Jenkins Maven pipeline.
 */
public class App {

    public static String getName() {
        return "Dhruv Gangurde";
    }

    public static String getRole() {
        return "Computer Science Student";
    }

    public static int getProjectCount() {
        return 4;
    }

    public static void main(String[] args) {
        System.out.println("=================================");
        System.out.println("      Dhruv Gangurde Portfolio");
        System.out.println("=================================");
        System.out.println("Name: " + getName());
        System.out.println("Role: " + getRole());
        System.out.println("Projects: " + getProjectCount());
    }
}