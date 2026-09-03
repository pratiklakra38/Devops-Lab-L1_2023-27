-- User insertion handled by CommandLineRunner in PortfolioApplication.java

-- Insert Initial Skills
INSERT INTO skills (name, percentage, icon_class) VALUES 
('Full Stack Web Dev', 85, 'fas fa-laptop-code'),
('Data Structures', 80, 'fas fa-project-diagram'),
('C/C++', 85, 'fas fa-code'),
('Python', 80, 'fab fa-python'),
('MySQL', 85, 'fas fa-database'),
('JavaScript', 80, 'fab fa-js'),
('Git', 85, 'fab fa-git-alt'),
('Docker', 75, 'fab fa-docker'),
('JIRA', 70, 'fab fa-jira'),
('AWS', 70, 'fab fa-aws'),
('Figma UI/UX', 65, 'fab fa-figma'),
('Adobe Premiere Pro', 80, 'fas fa-video');

-- Insert Initial Projects
INSERT INTO projects (title, description, technology_stack, github_url, demo_url, image_url) VALUES 
('Real Time IMS Data Pipeline', 'Built a real-time IMS log processing pipeline to ingest and analyze IBM IMS logs, generate operational KPIs, visualize system performance through interactive dashboards, and support anomaly detection for improved operational monitoring.', 'Kafka, Spark, PostgreSQL, Grafana', 'https://github.com', '', ''),
('FinShield - Agentic AI Fraud Detection', 'Built an AI-powered fraud detection platform that evaluates transactions through behavioral, temporal, geographic, and device analysis. Generated risk scores and automated transaction classification to improve fraud detection accuracy.', 'FastAPI, React, Groq LLM', 'https://github.com', '', '');
