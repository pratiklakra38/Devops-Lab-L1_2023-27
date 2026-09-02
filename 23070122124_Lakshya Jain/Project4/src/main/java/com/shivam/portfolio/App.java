package com.shivam.portfolio;

import com.shivam.portfolio.model.Resume;
import com.shivam.portfolio.service.PortfolioService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class App {
    public static void main(String[] args) {
        System.out.println("=====================================================================");
        System.out.println("   ____  ___  ____ _____ _____ ___  _     ___ ___    ____  _____     ");
        System.out.println("  |  _ \\/ _ \\|  _ \\_   _|  ___/ _ \\| |   |_ _/ _ \\  |  _ \\|  ___|    ");
        System.out.println("  | |_) | | | | |_) || | | |_ | | | | |    | | | | | | |_) | |_       ");
        System.out.println("  |  __/| |_| |  _ < | | |  _|| |_| | |___ | | |_| | |  _ <|  _|      ");
        System.out.println("  |_|    \\___/|_| \\_\\|_| |_|   \\___/|_____|___\\___/  |_| \\_\\_|       ");
        System.out.println("=====================================================================");
        System.out.println("                     SHIVAM KAPURE - JAVA PORTFOLIO                  ");
        System.out.println("=====================================================================");

        PortfolioService service = new PortfolioService();
        Resume resume = service.getResume();

        // Print Basic Details to Console
        System.out.println("Name:      " + resume.getContact().getName());
        System.out.println("Email:     " + resume.getContact().getEmail());
        System.out.println("Phone:     " + resume.getContact().getPhone());
        System.out.println("Location:  " + resume.getContact().getLocation());
        System.out.println("GitHub:    " + resume.getContact().getGithub());
        System.out.println("LinkedIn:  " + resume.getContact().getLinkedin());
        System.out.println("---------------------------------------------------------------------");

        // Print Education
        System.out.println("EDUCATION:");
        for (Resume.Education edu : resume.getEducationList()) {
            System.out.printf("  * %s - %s\n", edu.getInstitution(), edu.getDegree());
            System.out.printf("    CGPA: %s | Timeline: %s | Location: %s\n", edu.getCgpa(), edu.getDate(), edu.getLocation());
        }
        System.out.println("---------------------------------------------------------------------");

        // Print Skills
        System.out.println("TECHNICAL SKILLS:");
        for (Map.Entry<String, List<String>> entry : resume.getSkills().entrySet()) {
            System.out.printf("  * %-20s : %s\n", entry.getKey(), String.join(", ", entry.getValue()));
        }
        System.out.println("---------------------------------------------------------------------");

        // Print Projects
        System.out.println("FEATURED PROJECTS:");
        for (Resume.Project proj : resume.getProjects()) {
            System.out.printf("  * %s (%s) - %s\n", proj.getTitle(), proj.getTechnologies(), proj.getDate());
            for (String detail : proj.getDetails()) {
                System.out.printf("    - %s\n", detail);
            }
        }
        System.out.println("---------------------------------------------------------------------");

        // Generate HTML Portfolio
        String outputFileName = "portfolio.html";
        try {
            System.out.println("Generating stunning HTML portfolio...");
            service.generateHtmlPortfolio(outputFileName);
            System.out.println("SUCCESS: Generated premium HTML portfolio at: " + outputFileName);
        } catch (IOException e) {
            System.err.println("ERROR: Failed to generate HTML portfolio: " + e.getMessage());
        }
        System.out.println("=====================================================================");
    }
}
