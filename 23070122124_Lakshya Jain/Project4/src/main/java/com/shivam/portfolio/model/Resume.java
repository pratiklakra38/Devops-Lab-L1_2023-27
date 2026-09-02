package com.shivam.portfolio.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Resume {
    private Contact contact;
    private List<Education> educationList = new ArrayList<>();
    private Map<String, List<String>> skills; // e.g., "Languages" -> ["Python", "Java"]
    private List<Project> projects = new ArrayList<>();
    private List<Certification> certifications = new ArrayList<>();
    private List<Extracurricular> extracurriculars = new ArrayList<>();

    // Contact Inner Class
    public static class Contact {
        private String name;
        private String location;
        private String email;
        private String phone;
        private String linkedin;
        private String github;

        public Contact(String name, String location, String email, String phone, String linkedin, String github) {
            this.name = name;
            this.location = location;
            this.email = email;
            this.phone = phone;
            this.linkedin = linkedin;
            this.github = github;
        }

        public String getName() { return name; }
        public String getLocation() { return location; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getLinkedin() { return linkedin; }
        public String getGithub() { return github; }
    }

    // Education Inner Class
    public static class Education {
        private String institution;
        private String degree;
        private String cgpa;
        private String date;
        private String location;

        public Education(String institution, String degree, String cgpa, String date, String location) {
            this.institution = institution;
            this.degree = degree;
            this.cgpa = cgpa;
            this.date = date;
            this.location = location;
        }

        public String getInstitution() { return institution; }
        public String getDegree() { return degree; }
        public String getCgpa() { return cgpa; }
        public String getDate() { return date; }
        public String getLocation() { return location; }
    }

    // Project Inner Class
    public static class Project {
        private String title;
        private String technologies;
        private String date;
        private List<String> details;

        public Project(String title, String technologies, String date, List<String> details) {
            this.title = title;
            this.technologies = technologies;
            this.date = date;
            this.details = details;
        }

        public String getTitle() { return title; }
        public String getTechnologies() { return technologies; }
        public String getDate() { return date; }
        public List<String> getDetails() { return details; }
    }

    // Certification Inner Class
    public static class Certification {
        private String name;
        private String issuer;

        public Certification(String name, String issuer) {
            this.name = name;
            this.issuer = issuer;
        }

        public String getName() { return name; }
        public String getIssuer() { return issuer; }
    }

    // Extracurricular Inner Class
    public static class Extracurricular {
        private String organization;
        private String date;
        private String role;
        private String location;
        private List<String> details;

        public Extracurricular(String organization, String date, String role, String location, List<String> details) {
            this.organization = organization;
            this.date = date;
            this.role = role;
            this.location = location;
            this.details = details;
        }

        public String getOrganization() { return organization; }
        public String getDate() { return date; }
        public String getRole() { return role; }
        public String getLocation() { return location; }
        public List<String> getDetails() { return details; }
    }

    // Getters and Setters
    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }

    public List<Education> getEducationList() { return educationList; }
    public void setEducationList(List<Education> educationList) { this.educationList = educationList; }

    public Map<String, List<String>> getSkills() { return skills; }
    public void setSkills(Map<String, List<String>> skills) { this.skills = skills; }

    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }

    public List<Certification> getCertifications() { return certifications; }
    public void setCertifications(List<Certification> certifications) { this.certifications = certifications; }

    public List<Extracurricular> getExtracurriculars() { return extracurriculars; }
    public void setExtracurriculars(List<Extracurricular> extracurriculars) { this.extracurriculars = extracurriculars; }
}
