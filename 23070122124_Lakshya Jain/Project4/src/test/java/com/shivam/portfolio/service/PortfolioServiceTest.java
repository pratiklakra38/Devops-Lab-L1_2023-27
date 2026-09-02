package com.shivam.portfolio.service;

import com.shivam.portfolio.model.Resume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class PortfolioServiceTest {

    private PortfolioService service;

    @BeforeEach
    public void setUp() {
        service = new PortfolioService();
    }

    @Test
    public void testResumePopulation() {
        Resume resume = service.getResume();
        assertNotNull(resume);
        assertNotNull(resume.getContact());
        assertEquals("Shivam Kapure", resume.getContact().getName());
        assertEquals("kapureshivampc@gmail.com", resume.getContact().getEmail());
        assertFalse(resume.getEducationList().isEmpty());
        assertFalse(resume.getProjects().isEmpty());
        assertFalse(resume.getSkills().isEmpty());
    }

    @Test
    public void testProjectSearch() {
        // Search by title
        List<Resume.Project> queueFlow = service.searchProjects("QueueFlow");
        assertEquals(1, queueFlow.size());
        assertEquals("QueueFlow", queueFlow.get(0).getTitle());

        // Search by technology keyword
        List<Resume.Project> reactProjects = service.searchProjects("React");
        // React should match both QueueFlow and Vault
        assertEquals(2, reactProjects.size());

        // Search with non-existent keyword
        List<Resume.Project> emptyResults = service.searchProjects("Spring Boot");
        assertTrue(emptyResults.isEmpty());

        // Search with null or blank should return all projects
        List<Resume.Project> allProjects = service.searchProjects("");
        assertEquals(3, allProjects.size());
    }

    @Test
    public void testEmailValidation() {
        assertTrue(service.isValidEmail("kapureshivampc@gmail.com"));
        assertTrue(service.isValidEmail("shivam.kapure@sitpune.edu.in"));
        assertFalse(service.isValidEmail("invalid-email"));
        assertFalse(service.isValidEmail("shivam@"));
        assertFalse(service.isValidEmail(null));
    }

    @Test
    public void testHtmlGeneration() throws IOException {
        String testPath = "target/test_portfolio.html";
        File file = new File(testPath);
        
        // Ensure parent directory exists
        file.getParentFile().mkdirs();
        
        // Delete if already exists
        if (file.exists()) {
            assertTrue(file.delete());
        }

        // Generate HTML
        service.generateHtmlPortfolio(testPath);

        // Verify file is created and not empty
        assertTrue(file.exists());
        assertTrue(file.length() > 0);

        // Clean up
        file.delete();
    }
}
