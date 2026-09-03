-- User insertion handled by CommandLineRunner in PortfolioApplication.java

-- Insert Initial Skills
INSERT INTO skills (name, percentage, icon_class) VALUES 
('C++', 85, 'fas fa-code'),
('Python', 85, 'fab fa-python'),
('JavaScript', 80, 'fab fa-js'),
('Data Structures & Algorithms', 85, 'fas fa-project-diagram'),
('React.js', 80, 'fab fa-react'),
('Node.js / Express.js', 80, 'fab fa-node-js'),
('MongoDB', 75, 'fas fa-leaf'),
('MySQL', 80, 'fas fa-database'),
('Docker', 75, 'fab fa-docker'),
('Git & GitHub', 85, 'fab fa-git-alt'),
('AWS (EC2)', 70, 'fab fa-aws'),
('Scikit-learn / Pandas', 75, 'fas fa-brain');

-- Insert Initial Projects
INSERT INTO projects (title, description, technology_stack, github_url, demo_url, image_url) VALUES 
('FinVeritas', 'A multi-agent AI platform that extracts data from complex PDFs and live APIs, keeping all computations in Python for calculation accuracy. A 9-point credibility engine cross-checks accounting balances so the LLMs produce explainable analysis without hallucinating numbers. Deployed on AWS EC2 with JWT authentication and OTP-based password recovery. Ranked 1st at the Industry Conclave among 80+ projects.', 'Python, Streamlit, MongoDB, Multi-Agent LLMs, AWS', 'https://github.com/rocko131205', '', ''),
('Insurance Charges Prediction', 'A machine learning model that predicts medical insurance expenses from age, BMI, smoking status and other personal characteristics, reaching an R2 score of 0.90. Built through exploratory data analysis, feature engineering and hyperparameter tuning across Linear Regression, Random Forest and Gradient Boosting to select the best-performing model.', 'Python, Pandas, Scikit-learn, Matplotlib', 'https://github.com/rocko131205', '', ''),
('Distributed Jenkins CI Pipeline', 'A DevOps lab project that splits a Jenkins build across a controller and two labelled agents: one agent checks out, compiles, packages and archives while a second runs the test suite on its own filesystem, with the workspace transferred between them by stash/unstash and JUnit results published back to the controller.', 'Jenkins, Maven, Docker, Spring Boot, JUnit 5', 'https://github.com/rocko131205/Devops-Lab-L1_2023-27', '', '');
