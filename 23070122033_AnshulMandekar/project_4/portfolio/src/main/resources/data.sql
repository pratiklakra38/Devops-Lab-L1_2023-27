-- User insertion handled by CommandLineRunner in PortfolioApplication.java

-- Insert Initial Skills
INSERT INTO skills (name, percentage, icon_class) VALUES 
('MERN Stack (Node.js, Express, React.js)', 90, 'fab fa-js'),
('C++ & Data Structures (DSA & OOP)', 90, 'fas fa-code'),
('Python & Deep Learning (CNN, TensorRT)', 85, 'fab fa-python'),
('LangChain & LLM Agents (LangGraph, RAG)', 88, 'fas fa-robot'),
('RESTful APIs & Microservices Architecture', 90, 'fas fa-network-wired'),
('SQL & Relational Databases (MySQL)', 85, 'fas fa-database'),
('NoSQL Databases (MongoDB/Mongoose)', 85, 'fas fa-leaf'),
('AWS Cloud (EC2, S3, ELB, ASG)', 82, 'fab fa-aws'),
('Docker & Kubernetes', 80, 'fab fa-docker'),
('Event-Driven Architecture & Apache Kafka', 78, 'fas fa-stream'),
('WebSockets & Socket.IO (Real-time App)', 85, 'fas fa-bolt'),
('Git, Agile, TDD/BDD & DevOps', 90, 'fab fa-git-alt');

-- Insert Initial Projects
INSERT INTO projects (title, description, technology_stack, github_url, demo_url, image_url) VALUES 
('Explainable Financial Background Review System', 'Built a multi-agent LLM system with 7 specialized financial agents using LangGraph deployed on AWS EC2 with ~97% uptime (Rank 1 at Industry Conclave 2026). Automated extraction & analysis of 50+ financial metrics from Fortune 500 Bloomberg PDFs with ~3.2s parse latency and achieved 1.00 correctness & 0.833 cross-reference coverage scores.', 'LangChain, LangGraph, LLM Agents, RAG, Streamlit, AWS EC2, Python', 'https://github.com/AnshulMandekar', 'https://portfolio-website-anshul-1.onrender.com/anshul.html', ''),
('ISKCON Memorial Platform', 'Built a responsive React.js frontend with Vite, TypeScript, Tailwind CSS, and Shadcn UI serving 100+ concurrent users with cross-browser compatibility. Achieved 90+ Google PageSpeed score using Cloudinary CDN, lazy loading, and code-splitting. Integrated 12+ REST APIs with JWT authentication, OAuth2, and RBAC.', 'Node.js, Express, MongoDB, React.js, Vite, TypeScript, Tailwind CSS, AWS EC2, JWT', 'https://github.com/AnshulMandekar', 'https://portfolio-website-anshul-1.onrender.com/anshul.html', ''),
('Intrusion Detection System (IDS)', 'Built a multi-class Intrusion Detection System using a CNN on the CICIDS2017 dataset (500,000+ records), featuring a novel 1D-to-2D feature transformation reshaping network flow data into 9x9 grayscale image matrices. Evaluated Sequential CNN compiled with Adam optimizer, achieving 95%+ accuracy across 12 attack classes.', 'CNN, Feature Engineering, TensorRT, Python, NumPy, Pandas, Deep Learning', 'https://github.com/AnshulMandekar', '', '');

