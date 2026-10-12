-- ============================================================================
-- Jobs and Freelance Marketplace - Database Schema
-- Database: jobs_marketplace
-- Compatible with MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `jobs_marketplace`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `jobs_marketplace`;

-- Disable foreign key checks during schema re-creation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `proposals`;
DROP TABLE IF EXISTS `job_applications`;
DROP TABLE IF EXISTS `freelance_projects`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `user_skills`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `user_profiles`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Table: users
-- Core authentication table for all platform users and roles
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('JOB_SEEKER', 'FREELANCER', 'EMPLOYER', 'ADMIN') NOT NULL,
  `status` ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Table: user_profiles
-- Rich portfolio, contact, experience, and bio details for job seekers and freelancers
-- ----------------------------------------------------------------------------
CREATE TABLE `user_profiles` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL UNIQUE,
  `headline` VARCHAR(200),
  `bio` TEXT,
  `location` VARCHAR(150),
  `phone` VARCHAR(30),
  `website` VARCHAR(255),
  `github` VARCHAR(255),
  `linkedin` VARCHAR(255),
  `hourly_rate` DECIMAL(10, 2) DEFAULT 0.00,
  `experience_years` INT DEFAULT 0,
  `education` VARCHAR(255),
  `avatar_url` VARCHAR(500),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Table: skills
-- Master list of searchable technical and creative skills
-- ----------------------------------------------------------------------------
CREATE TABLE `skills` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Table: user_skills
-- Association between users and their tagged skills
-- ----------------------------------------------------------------------------
CREATE TABLE `user_skills` (
  `user_id` BIGINT NOT NULL,
  `skill_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`, `skill_id`),
  CONSTRAINT `fk_userskills_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_userskills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table: jobs
-- Job postings created by Employers
-- ----------------------------------------------------------------------------
CREATE TABLE `jobs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `employer_id` BIGINT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `requirements` TEXT,
  `responsibilities` TEXT,
  `category` VARCHAR(100) NOT NULL,
  `job_type` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
  `location` VARCHAR(150) NOT NULL,
  `is_remote` BOOLEAN NOT NULL DEFAULT FALSE,
  `salary_min` DECIMAL(12, 2),
  `salary_max` DECIMAL(12, 2),
  `salary_currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `experience_level` VARCHAR(50) DEFAULT 'Mid Level',
  `status` ENUM('ACTIVE', 'CLOSED', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `views_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_jobs_category` (`category`),
  INDEX `idx_jobs_job_type` (`job_type`),
  INDEX `idx_jobs_status` (`status`),
  INDEX `idx_jobs_employer` (`employer_id`),
  CONSTRAINT `fk_jobs_employer` FOREIGN KEY (`employer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Table: job_applications
-- Applications submitted by Job Seekers for specific jobs
-- ----------------------------------------------------------------------------
CREATE TABLE `job_applications` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `job_id` BIGINT NOT NULL,
  `applicant_id` BIGINT NOT NULL,
  `cover_letter` TEXT,
  `resume_url` VARCHAR(500),
  `status` ENUM('PENDING', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_job_applicant` (`job_id`, `applicant_id`),
  INDEX `idx_applications_status` (`status`),
  INDEX `idx_applications_applicant` (`applicant_id`),
  CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_applications_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Table: freelance_projects
-- Projects posted by Clients / Employers for Freelancers to bid on
-- ----------------------------------------------------------------------------
CREATE TABLE `freelance_projects` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `client_id` BIGINT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `project_type` ENUM('FIXED', 'HOURLY') NOT NULL DEFAULT 'FIXED',
  `budget_min` DECIMAL(12, 2),
  `budget_max` DECIMAL(12, 2),
  `deadline` DATE,
  `duration` VARCHAR(100),
  `skills_required` VARCHAR(500),
  `status` ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
  `views_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_category` (`category`),
  INDEX `idx_projects_status` (`status`),
  INDEX `idx_projects_client` (`client_id`),
  CONSTRAINT `fk_projects_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Table: proposals
-- Bids/proposals submitted by Freelancers for freelance projects
-- ----------------------------------------------------------------------------
CREATE TABLE `proposals` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT NOT NULL,
  `freelancer_id` BIGINT NOT NULL,
  `cover_letter` TEXT NOT NULL,
  `bid_amount` DECIMAL(12, 2) NOT NULL,
  `estimated_days` INT NOT NULL,
  `status` ENUM('PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_freelancer` (`project_id`, `freelancer_id`),
  INDEX `idx_proposals_status` (`status`),
  INDEX `idx_proposals_freelancer` (`freelancer_id`),
  CONSTRAINT `fk_proposals_project` FOREIGN KEY (`project_id`) REFERENCES `freelance_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_proposals_freelancer` FOREIGN KEY (`freelancer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- OPTIONAL SAMPLE SEED DATA (Password for all demo users is: password123)
-- BCrypt hash for "password123": $2a$10$w8T9Vv4v7R3Okn0wI69Ndu47n.Vl2tN22qX9j60eYg1NnL1vY4tOa
-- The Spring Boot application DataInitializer also safely initializes demo data
-- if tables are empty.
-- ============================================================================

INSERT INTO `skills` (`name`) VALUES
('React.js'), ('Node.js'), ('Spring Boot'), ('Java'), ('MySQL'),
('TypeScript'), ('Python'), ('AWS'), ('UI/UX Design'), ('Docker'),
('GraphQL'), ('Tailwind CSS'), ('Project Management'), ('DevOps');

-- Default Demo Users (Password: password123)
INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `role`, `status`) VALUES
(1, 'admin@marketplace.com', '$2a$10$fG6mOekyH.aW9i1/b4g3GOmZ0k2yGgKq3c3Rz5Y2X0kE0h4l5yPee', 'Platform Admin', 'ADMIN', 'ACTIVE'),
(2, 'techcorp@employer.com', '$2a$10$fG6mOekyH.aW9i1/b4g3GOmZ0k2yGgKq3c3Rz5Y2X0kE0h4l5yPee', 'TechCorp Solutions', 'EMPLOYER', 'ACTIVE'),
(3, 'sarah.dev@freelancer.com', '$2a$10$fG6mOekyH.aW9i1/b4g3GOmZ0k2yGgKq3c3Rz5Y2X0kE0h4l5yPee', 'Sarah Jenkins', 'FREELANCER', 'ACTIVE'),
(4, 'alex.seeker@jobseeker.com', '$2a$10$fG6mOekyH.aW9i1/b4g3GOmZ0k2yGgKq3c3Rz5Y2X0kE0h4l5yPee', 'Alex Morgan', 'JOB_SEEKER', 'ACTIVE');

-- User Profiles
INSERT INTO `user_profiles` (`user_id`, `headline`, `bio`, `location`, `phone`, `website`, `github`, `linkedin`, `hourly_rate`, `experience_years`, `education`, `avatar_url`) VALUES
(2, 'Leading Cloud & Enterprise Software Agency', 'We build scalable web platforms and hire top software engineering talent worldwide.', 'San Francisco, CA', '+1 (555) 019-2834', 'https://techcorp.example.com', '', 'https://linkedin.com/company/techcorp', 0.00, 10, 'Enterprise Accredited', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150'),
(3, 'Senior Full-Stack Developer & UI/UX Specialist', 'Over 6 years of experience building modern web applications with React, Java Spring Boot, and cloud architecture. Passionate about performant, accessible web experiences.', 'Austin, TX', '+1 (555) 302-8472', 'https://sarahjenkins.dev', 'https://github.com/sarah-dev', 'https://linkedin.com/in/sarahjenkins-dev', 65.00, 6, 'B.S. in Computer Science, UT Austin', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
(4, 'Frontend Engineer & React Developer', 'Motivated software engineer with hands-on experience building clean, responsive interfaces. Looking for full-time or remote developer roles.', 'Seattle, WA', '+1 (555) 441-9283', 'https://alexmorgan.dev', 'https://github.com/alexmorgan', 'https://linkedin.com/in/alexmorgan', 45.00, 3, 'B.S. in Software Engineering, UW', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');

-- User Skills Mapping
INSERT INTO `user_skills` (`user_id`, `skill_id`) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 9),
(4, 1), (4, 6), (4, 9), (4, 12);

-- Sample Jobs
INSERT INTO `jobs` (`id`, `employer_id`, `title`, `company_name`, `description`, `requirements`, `responsibilities`, `category`, `job_type`, `location`, `is_remote`, `salary_min`, `salary_max`, `salary_currency`, `experience_level`, `status`, `views_count`) VALUES
(1, 2, 'Senior Full Stack Java Engineer', 'TechCorp Solutions', 'Join our core platform engineering team to build high-scale cloud microservices and intuitive user interfaces. You will collaborate directly with product and design leads to deliver resilient software.', '5+ years experience with Java, Spring Boot, MySQL, and modern JavaScript frameworks (React or Angular). Strong knowledge of REST architecture, Docker, and CI/CD pipelines.', 'Architect and develop robust RESTful microservices. Optimize SQL queries and database schemas. Mentor junior engineers and conduct code reviews.', 'Software Development', 'FULL_TIME', 'San Francisco, CA', TRUE, 120000.00, 160000.00, 'USD', 'Senior Level', 'ACTIVE', 142),
(2, 2, 'React Frontend Developer', 'TechCorp Solutions', 'We are looking for a creative and detail-oriented Frontend Developer to craft sleek web portals with modern React and CSS.', '3+ years experience with React.js, modern CSS, state management, and responsive layouts. Experience integrating REST APIs and writing clean, testable code.', 'Build reusable React components. Collaborate with UX designers to translate Figma mockups into pixel-perfect pages. Improve frontend performance and accessibility.', 'Software Development', 'REMOTE', 'Remote / US', TRUE, 90000.00, 125000.00, 'USD', 'Mid Level', 'ACTIVE', 98),
(3, 2, 'DevOps & Cloud Infrastructure Specialist', 'TechCorp Solutions', 'Help us streamline deployments, improve uptime, and maintain automated CI/CD workflows on AWS and Docker environments.', 'Experience with AWS, Docker, Kubernetes, Linux sysadmin, and GitHub Actions.', 'Maintain cloud infrastructure, monitor system performance, automate deployments.', 'DevOps & Cloud', 'CONTRACT', 'Austin, TX', FALSE, 100000.00, 130000.00, 'USD', 'Mid Level', 'ACTIVE', 64);

-- Sample Freelance Projects
INSERT INTO `freelance_projects` (`id`, `client_id`, `title`, `description`, `category`, `project_type`, `budget_min`, `budget_max`, `deadline`, `duration`, `skills_required`, `status`, `views_count`) VALUES
(1, 2, 'E-Commerce Dashboard Redesign & React Migration', 'We need an experienced frontend developer to redesign our merchant analytics dashboard and migrate existing legacy templates to clean, modular React components.', 'Web & Mobile', 'FIXED', 3000.00, 4500.00, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), '1 month', 'React.js, Tailwind CSS, REST APIs, Chart.js', 'OPEN', 85),
(2, 2, 'Spring Boot Payment Gateway Integration', 'Looking for a skilled backend Java developer to implement Stripe & PayPal webhooks, subscription billing logic, and audit logging into an existing Spring Boot application.', 'Backend Development', 'HOURLY', 50.00, 80.00, DATE_ADD(CURRENT_DATE, INTERVAL 20 DAY), '2-3 weeks', 'Java, Spring Boot, MySQL, REST APIs, Security', 'OPEN', 112);

-- Sample Job Application
INSERT INTO `job_applications` (`job_id`, `applicant_id`, `cover_letter`, `resume_url`, `status`) VALUES
(1, 4, 'Dear TechCorp Hiring Team,\n\nI am thrilled to apply for the Senior Full Stack Java Engineer role. Over the past 3 years I have developed scalable web solutions with Spring Boot and React. I look forward to contributing to your team.', 'https://alexmorgan.dev/resume.pdf', 'REVIEWING');

-- Sample Proposal
INSERT INTO `proposals` (`project_id`, `freelancer_id`, `cover_letter`, `bid_amount`, `estimated_days`, `status`) VALUES
(1, 3, 'Hi TechCorp Team,\n\nI have extensive experience redesigning dashboards and building high-performance React component libraries with clean state management. I can deliver this project within 20 days with comprehensive documentation.', 3500.00, 20, 'PENDING');
