package com.shivam.portfolio.service;

import com.shivam.portfolio.model.Resume;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PortfolioService {

    private final Resume resume;

    public PortfolioService() {
        this.resume = populateResumeData();
    }

    public Resume getResume() {
        return resume;
    }

    /**
     * Populates the resume model with Shivam Kapure's actual resume details.
     */
    private Resume populateResumeData() {
        Resume res = new Resume();

        // Contact details
        res.setContact(new Resume.Contact(
            "Shivam Kapure",
            "Pune, Maharashtra, IN",
            "kapureshivampc@gmail.com",
            "+91 8080246293",
            "linkedin.com/in/shivam-kapure",
            "github.com/Shivam-Kapure"
        ));

        // Education
        List<Resume.Education> educations = new ArrayList<>();
        educations.add(new Resume.Education(
            "Symbiosis Institute of Technology, SIU",
            "Bachelor of Technology in Computer Science and Engineering",
            "8.00 CGPA",
            "May 2027 (Expected)",
            "Pune, IN"
        ));
        res.setEducationList(educations);

        // Skills (LinkedHashMap to preserve section order)
        Map<String, List<String>> skills = new LinkedHashMap<>();
        skills.put("Languages", List.of("Python", "C/C++", "SQL", "JavaScript", "TypeScript"));
        skills.put("Data Science", List.of("Pandas", "NumPy", "scikit-learn", "Matplotlib", "Seaborn"));
        skills.put("Backend", List.of("Node.js", "Express.js", "REST APIs", "Socket.io"));
        skills.put("Databases & ORMs", List.of("PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma ORM"));
        skills.put("Developer Tools", List.of("Git", "Docker", "AWS", "Linux", "Postman", "Figma", "PowerBI"));
        res.setSkills(skills);

        // Projects
        List<Resume.Project> projects = new ArrayList<>();
        
        projects.add(new Resume.Project(
            "Infant Mortality Rate Predictor",
            "Python, Pandas, scikit-learn, Random Forest, Gradient Boosting",
            "March 2025",
            List.of(
                "Developed machine learning models to predict infant mortality using healthcare and socio-economic indicators through data-driven analysis.",
                "Processed and cleaned large healthcare datasets while performing feature engineering and exploratory data analysis for improved model performance.",
                "Evaluated predictive models using regression metrics and feature importance analysis to identify key factors influencing infant mortality."
            )
        ));

        projects.add(new Resume.Project(
            "QueueFlow",
            "React, Node.js, Express.js, PostgreSQL, Socket.io, Prisma ORM",
            "May 2026",
            List.of(
                "Built a real-time virtual waiting room platform supporting synchronized queue management with live user position tracking.",
                "Designed FIFO and priority-based queue scheduling with wait-time estimation and automated admission workflows for events.",
                "Engineered a scalable backend using WebSockets, JWT authentication, RBAC, and persistent queue state management."
            )
        ));

        projects.add(new Resume.Project(
            "Vault – Secure File Sharing Platform",
            "React, Node.js, Express.js, MongoDB, JWT, REST APIs, AES-256",
            "February 2026",
            List.of(
                "Developed a secure file-sharing system with AES-256 encryption to ensure end-to-end data protection.",
                "Implemented JWT-based authentication and role-based access control to govern secure file operations.",
                "Strengthened application security through input validation, request-level protection, and resilient API design, and optimized upload/download pipelines with caching."
            )
        ));
        res.setProjects(projects);

        // Certifications
        List<Resume.Certification> certifications = new ArrayList<>();
        certifications.add(new Resume.Certification("Machine Learning Specialization", "Stanford University"));
        certifications.add(new Resume.Certification("Python for Data Science and Machine Learning Bootcamp", "Udemy"));
        certifications.add(new Resume.Certification("Nutanix Certified Associate 6.10", "Nutanix"));
        certifications.add(new Resume.Certification("Cloud Computing Fundamentals", "IBM SkillsBuild"));
        certifications.add(new Resume.Certification("Cisco Certified Network Associate", "Cisco"));
        res.setCertifications(certifications);

        // Extracurriculars
        List<Resume.Extracurricular> extracurriculars = new ArrayList<>();
        extracurriculars.add(new Resume.Extracurricular(
            "Sevadeep NGO",
            "July 2025 - December 2025",
            "Volunteer",
            "Baner, Pune",
            List.of(
                "Collaborated with a team of 5 members to develop a Volunteer Management System for the NGO to track volunteer activities.",
                "Tutored 40+ underprivileged students and participated in community welfare drives including tree plantation and cleanliness drives.",
                "Managed logistics and packaging of food for donation drives."
            )
        ));
        res.setExtracurriculars(extracurriculars);

        return res;
    }

    /**
     * Search projects by query keyword in the title or technologies list.
     */
    public List<Resume.Project> searchProjects(String query) {
        if (query == null || query.isBlank()) {
            return resume.getProjects();
        }
        String lowerQuery = query.toLowerCase();
        return resume.getProjects().stream()
                .filter(p -> p.getTitle().toLowerCase().contains(lowerQuery) ||
                             p.getTechnologies().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
    }

    /**
     * Helper to validate email addresses.
     */
    public boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    /**
     * Generates a premium HTML portfolio of Shivam's resume and saves it to the given path.
     */
    public void generateHtmlPortfolio(String outputPath) throws IOException {
        StringBuilder html = new StringBuilder();
        
        // CSS & styling block
        String styles = """
            :root {
                --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                --glass-bg: rgba(30, 41, 59, 0.45);
                --glass-border: rgba(255, 255, 255, 0.08);
                --text-primary: #f8fafc;
                --text-secondary: #94a3b8;
                --accent-primary: #818cf8;
                --accent-secondary: #c084fc;
                --card-bg: rgba(15, 23, 42, 0.6);
                --card-border: rgba(129, 140, 248, 0.15);
                --badge-bg: rgba(129, 140, 248, 0.1);
                --badge-text: #a5b4fc;
            }
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Outfit', 'Inter', sans-serif;
                background: var(--bg-gradient);
                color: var(--text-primary);
                min-height: 100vh;
                line-height: 1.6;
                padding: 2rem 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                max-width: 1100px;
                width: 100%;
                background: var(--glass-bg);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid var(--glass-border);
                border-radius: 24px;
                padding: 2.5rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }
            header {
                text-align: center;
                margin-bottom: 2.5rem;
                border-bottom: 1px solid var(--glass-border);
                padding-bottom: 2rem;
            }
            h1 {
                font-size: 3rem;
                font-weight: 800;
                background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 0.5rem;
                letter-spacing: -0.025em;
            }
            .subtitle {
                font-size: 1.25rem;
                color: var(--text-secondary);
                margin-bottom: 1rem;
                font-weight: 400;
            }
            .contact-links {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 1.5rem;
                margin-top: 1rem;
            }
            .contact-link {
                color: var(--text-secondary);
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.95rem;
                transition: color 0.2s, transform 0.2s;
            }
            .contact-link:hover {
                color: var(--accent-primary);
                transform: translateY(-2px);
            }
            .grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            @media (min-width: 768px) {
                .grid {
                    grid-template-columns: 1fr 2fr;
                }
            }
            section {
                margin-bottom: 2rem;
            }
            h2 {
                font-size: 1.5rem;
                margin-bottom: 1.25rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                border-left: 4px solid var(--accent-primary);
                padding-left: 0.75rem;
            }
            .card {
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 1.25rem;
                transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
            }
            .card:hover {
                transform: translateY(-4px);
                border-color: var(--accent-primary);
                box-shadow: 0 10px 20px -10px rgba(129, 140, 248, 0.2);
            }
            .card-title {
                font-size: 1.2rem;
                font-weight: 700;
                margin-bottom: 0.25rem;
                color: var(--text-primary);
            }
            .card-subtitle {
                font-size: 0.9rem;
                color: var(--accent-primary);
                margin-bottom: 0.75rem;
                font-weight: 500;
            }
            .card-meta {
                display: flex;
                justify-content: space-between;
                font-size: 0.85rem;
                color: var(--text-secondary);
                margin-bottom: 0.75rem;
            }
            .card-bullets {
                list-style-type: none;
                font-size: 0.95rem;
                color: var(--text-secondary);
            }
            .card-bullets li {
                margin-bottom: 0.5rem;
                position: relative;
                padding-left: 1.25rem;
            }
            .card-bullets li::before {
                content: "•";
                color: var(--accent-primary);
                position: absolute;
                left: 0;
                font-weight: bold;
            }
            .skill-group {
                margin-bottom: 1.25rem;
            }
            .skill-group-title {
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            .skill-badges {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .badge {
                background: var(--badge-bg);
                color: var(--badge-text);
                border: 1px solid rgba(129, 140, 248, 0.25);
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.85rem;
                font-weight: 500;
                transition: background 0.2s, color 0.2s;
            }
            .badge:hover {
                background: var(--accent-primary);
                color: #ffffff;
            }
            .cert-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                font-size: 0.95rem;
            }
            .cert-item:last-child {
                border-bottom: none;
            }
            .cert-name {
                font-weight: 500;
                color: var(--text-primary);
            }
            .cert-issuer {
                color: var(--accent-secondary);
                font-size: 0.85rem;
            }
        """;

        html.append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n");
        html.append("  <meta charset=\"UTF-8\">\n");
        html.append("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
        html.append("  <title>").append(resume.getContact().getName()).append(" - Portfolio</title>\n");
        html.append("  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n");
        html.append("  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n");
        html.append("  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\">\n");
        html.append("  <style>\n").append(styles).append("  </style>\n");
        html.append("</head>\n<body>\n");

        html.append("  <div class=\"container\">\n");

        // Header Section
        Resume.Contact contact = resume.getContact();
        html.append("    <header id=\"header\">\n");
        html.append("      <h1>").append(contact.getName()).append("</h1>\n");
        html.append("      <p class=\"subtitle\">Computer Science & Engineering Student</p>\n");
        html.append("      <p style=\"color: var(--text-secondary); font-size: 0.95rem;\">").append(contact.getLocation()).append("</p>\n");
        html.append("      <div class=\"contact-links\">\n");
        
        // Email Link
        html.append("        <a class=\"contact-link\" href=\"mailto:").append(contact.getEmail()).append("\">")
            .append("<svg width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383z\"/></svg> ")
            .append(contact.getEmail()).append("</a>\n");
            
        // Phone Link
        html.append("        <span class=\"contact-link\">")
            .append("<svg width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z\"/></svg> ")
            .append(contact.getPhone()).append("</span>\n");
            
        // LinkedIn Link
        html.append("        <a class=\"contact-link\" href=\"https://").append(contact.getLinkedin()).append("\" target=\"_blank\">")
            .append("<svg width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z\"/></svg> ")
            .append("LinkedIn").append("</a>\n");
            
        // GitHub Link
        html.append("        <a class=\"contact-link\" href=\"https://").append(contact.getGithub()).append("\" target=\"_blank\">")
            .append("<svg width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z\"/></svg> ")
            .append("GitHub").append("</a>\n");
            
        html.append("      </div>\n");
        html.append("    </header>\n");

        // Two-Column Grid
        html.append("    <div class=\"grid\">\n");

        // Left Column (Education, Skills, Certifications)
        html.append("      <div class=\"left-column\">\n");

        // Education Section
        html.append("        <section id=\"education\">\n");
        html.append("          <h2>Education</h2>\n");
        for (Resume.Education edu : resume.getEducationList()) {
            html.append("          <div class=\"card\">\n");
            html.append("            <div class=\"card-title\">").append(edu.getInstitution()).append("</div>\n");
            html.append("            <div class=\"card-subtitle\">").append(edu.getDegree()).append("</div>\n");
            html.append("            <div class=\"card-meta\">\n");
            html.append("              <span>").append(edu.getDate()).append("</span>\n");
            html.append("              <span>").append(edu.getCgpa()).append("</span>\n");
            html.append("            </div>\n");
            html.append("          </div>\n");
        }
        html.append("        </section>\n");

        // Skills Section
        html.append("        <section id=\"skills\">\n");
        html.append("          <h2>Technical Skills</h2>\n");
        html.append("          <div class=\"card\">\n");
        for (Map.Entry<String, List<String>> entry : resume.getSkills().entrySet()) {
            html.append("            <div class=\"skill-group\">\n");
            html.append("              <div class=\"skill-group-title\">").append(entry.getKey()).append("</div>\n");
            html.append("              <div class=\"skill-badges\">\n");
            for (String skill : entry.getValue()) {
                html.append("                <span class=\"badge\">").append(skill).append("</span>\n");
            }
            html.append("              </div>\n");
            html.append("            </div>\n");
        }
        html.append("          </div>\n");
        html.append("        </section>\n");

        // Certifications Section
        html.append("        <section id=\"certifications\">\n");
        html.append("          <h2>Certifications</h2>\n");
        html.append("          <div class=\"card\">\n");
        for (Resume.Certification cert : resume.getCertifications()) {
            html.append("            <div class=\"cert-item\">\n");
            html.append("              <span class=\"cert-name\">").append(cert.getName()).append("</span>\n");
            html.append("              <span class=\"cert-issuer\">").append(cert.getIssuer()).append("</span>\n");
            html.append("            </div>\n");
        }
        html.append("          </div>\n");
        html.append("        </section>\n");

        html.append("      </div>\n"); // End of Left Column

        // Right Column (Projects, Volunteer Work)
        html.append("      <div class=\"right-column\">\n");

        // Projects Section
        html.append("        <section id=\"projects\">\n");
        html.append("          <h2>Featured Projects</h2>\n");
        for (Resume.Project proj : resume.getProjects()) {
            html.append("          <div class=\"card\">\n");
            html.append("            <div style=\"display:flex; justify-content:space-between; align-items:flex-start;\">\n");
            html.append("              <div class=\"card-title\">").append(proj.getTitle()).append("</div>\n");
            html.append("              <span style=\"font-size:0.85rem; color:var(--text-secondary);\">").append(proj.getDate()).append("</span>\n");
            html.append("            </div>\n");
            html.append("            <div class=\"card-subtitle\">").append(proj.getTechnologies()).append("</div>\n");
            html.append("            <ul class=\"card-bullets\">\n");
            for (String detail : proj.getDetails()) {
                html.append("              <li>").append(detail).append("</li>\n");
            }
            html.append("            </ul>\n");
            html.append("          </div>\n");
        }
        html.append("        </section>\n");

        // Extracurricular / Volunteer Section
        html.append("        <section id=\"extracurricular\">\n");
        html.append("          <h2>Volunteer Experience</h2>\n");
        for (Resume.Extracurricular extra : resume.getExtracurriculars()) {
            html.append("          <div class=\"card\">\n");
            html.append("            <div style=\"display:flex; justify-content:space-between; align-items:flex-start;\">\n");
            html.append("              <div class=\"card-title\">").append(extra.getOrganization()).append("</div>\n");
            html.append("              <span style=\"font-size:0.85rem; color:var(--text-secondary);\">").append(extra.getDate()).append("</span>\n");
            html.append("            </div>\n");
            html.append("            <div class=\"card-subtitle\">").append(extra.getRole()).append(" - ").append(extra.getLocation()).append("</div>\n");
            html.append("            <ul class=\"card-bullets\">\n");
            for (String detail : extra.getDetails()) {
                html.append("              <li>").append(detail).append("</li>\n");
            }
            html.append("            </ul>\n");
            html.append("          </div>\n");
        }
        html.append("        </section>\n");

        html.append("      </div>\n"); // End of Right Column

        html.append("    </div>\n"); // End of Grid
        
        // Footer
        html.append("    <footer style=\"text-align: center; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); font-size: 0.85rem; color: var(--text-secondary);\">\n");
        html.append("      <p>Compiled and Verified with Java & Maven. Distributed Build Orchestrated by Jenkins.</p>\n");
        html.append("      <p style=\"margin-top: 0.25rem;\">&copy; 2026 Shivam Kapure. All rights reserved.</p>\n");
        html.append("    </footer>\n");

        html.append("  </div>\n"); // End of Container
        html.append("</body>\n</html>\n");

        try (FileWriter writer = new FileWriter(outputPath)) {
            writer.write(html.toString());
        }
    }
}
