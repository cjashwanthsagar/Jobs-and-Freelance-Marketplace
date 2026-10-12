package com.marketplace.config;

import com.marketplace.entity.*;
import com.marketplace.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final FreelanceProjectRepository projectRepository;
    private final JobApplicationRepository applicationRepository;
    private final ProposalRepository proposalRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           UserProfileRepository userProfileRepository,
                           SkillRepository skillRepository,
                           JobRepository jobRepository,
                           FreelanceProjectRepository projectRepository,
                           JobApplicationRepository applicationRepository,
                           ProposalRepository proposalRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.skillRepository = skillRepository;
        this.jobRepository = jobRepository;
        this.projectRepository = projectRepository;
        this.applicationRepository = applicationRepository;
        this.proposalRepository = proposalRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already contains users. Checking demo user passwords...");
            // Ensure demo users have properly hashed passwords in case schema was inserted manually
            ensureDemoUserPasswords();
            return;
        }

        logger.info("Initializing sample data for Jobs and Freelance Marketplace...");

        // 1. Skills
        List<String> skillNames = Arrays.asList(
                "React.js", "Node.js", "Spring Boot", "Java", "MySQL",
                "TypeScript", "Python", "AWS", "UI/UX Design", "Docker",
                "GraphQL", "Tailwind CSS", "Project Management", "DevOps"
        );
        Map<String, Skill> skillsMap = new HashMap<>();
        for (String name : skillNames) {
            skillsMap.put(name, skillRepository.save(new Skill(name)));
        }

        String encodedPassword = passwordEncoder.encode("password123");

        // 2. Users
        User admin = new User("admin@marketplace.com", encodedPassword, "Platform Admin", Role.ADMIN);
        admin = userRepository.save(admin);
        UserProfile adminProfile = new UserProfile(admin);
        adminProfile.setHeadline("Platform Administrator");
        adminProfile.setLocation("Remote");
        userProfileRepository.save(adminProfile);

        User employer = new User("techcorp@employer.com", encodedPassword, "TechCorp Solutions", Role.EMPLOYER);
        employer = userRepository.save(employer);
        UserProfile employerProfile = new UserProfile(employer);
        employerProfile.setHeadline("Leading Cloud & Enterprise Software Agency");
        employerProfile.setBio("We build scalable enterprise cloud platforms and hire top global engineering talent.");
        employerProfile.setLocation("San Francisco, CA");
        employerProfile.setPhone("+1 (555) 019-2834");
        employerProfile.setWebsite("https://techcorp.example.com");
        employerProfile.setLinkedin("https://linkedin.com/company/techcorp");
        employerProfile.setAvatarUrl("https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150");
        userProfileRepository.save(employerProfile);

        User freelancer = new User("sarah.dev@freelancer.com", encodedPassword, "Sarah Jenkins", Role.FREELANCER);
        freelancer.getSkills().add(skillsMap.get("React.js"));
        freelancer.getSkills().add(skillsMap.get("Node.js"));
        freelancer.getSkills().add(skillsMap.get("Spring Boot"));
        freelancer.getSkills().add(skillsMap.get("Java"));
        freelancer.getSkills().add(skillsMap.get("MySQL"));
        freelancer.getSkills().add(skillsMap.get("UI/UX Design"));
        freelancer = userRepository.save(freelancer);
        UserProfile freelancerProfile = new UserProfile(freelancer);
        freelancerProfile.setHeadline("Senior Full-Stack Developer & UI/UX Specialist");
        freelancerProfile.setBio("Over 6 years of experience building modern web applications with React, Java Spring Boot, and cloud architecture.");
        freelancerProfile.setLocation("Austin, TX");
        freelancerProfile.setPhone("+1 (555) 302-8472");
        freelancerProfile.setWebsite("https://sarahjenkins.dev");
        freelancerProfile.setGithub("https://github.com/sarah-dev");
        freelancerProfile.setLinkedin("https://linkedin.com/in/sarahjenkins-dev");
        freelancerProfile.setHourlyRate(new BigDecimal("65.00"));
        freelancerProfile.setExperienceYears(6);
        freelancerProfile.setEducation("B.S. in Computer Science, UT Austin");
        freelancerProfile.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
        userProfileRepository.save(freelancerProfile);

        User jobSeeker = new User("alex.seeker@jobseeker.com", encodedPassword, "Alex Morgan", Role.JOB_SEEKER);
        jobSeeker.getSkills().add(skillsMap.get("React.js"));
        jobSeeker.getSkills().add(skillsMap.get("TypeScript"));
        jobSeeker.getSkills().add(skillsMap.get("Tailwind CSS"));
        jobSeeker = userRepository.save(jobSeeker);
        UserProfile seekerProfile = new UserProfile(jobSeeker);
        seekerProfile.setHeadline("Frontend Engineer & React Developer");
        seekerProfile.setBio("Motivated software engineer with hands-on experience building clean, responsive interfaces.");
        seekerProfile.setLocation("Seattle, WA");
        seekerProfile.setPhone("+1 (555) 441-9283");
        seekerProfile.setWebsite("https://alexmorgan.dev");
        seekerProfile.setGithub("https://github.com/alexmorgan");
        seekerProfile.setLinkedin("https://linkedin.com/in/alexmorgan");
        seekerProfile.setHourlyRate(new BigDecimal("45.00"));
        seekerProfile.setExperienceYears(3);
        seekerProfile.setEducation("B.S. in Software Engineering, UW");
        seekerProfile.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        userProfileRepository.save(seekerProfile);

        // 3. Jobs
        Job job1 = new Job();
        job1.setEmployer(employer);
        job1.setTitle("Senior Full Stack Java Engineer");
        job1.setCompanyName("TechCorp Solutions");
        job1.setDescription("Join our core platform engineering team to build high-scale cloud microservices and intuitive user interfaces. You will collaborate directly with product and design leads.");
        job1.setRequirements("5+ years experience with Java, Spring Boot, MySQL, and modern JavaScript frameworks (React or Angular). Strong knowledge of REST architecture.");
        job1.setResponsibilities("Architect and develop robust RESTful microservices. Optimize SQL queries and database schemas. Mentor junior engineers.");
        job1.setCategory("Software Development");
        job1.setJobType(JobType.FULL_TIME);
        job1.setLocation("San Francisco, CA");
        job1.setIsRemote(true);
        job1.setSalaryMin(new BigDecimal("120000"));
        job1.setSalaryMax(new BigDecimal("160000"));
        job1.setSalaryCurrency("USD");
        job1.setExperienceLevel("Senior Level");
        job1.setStatus(JobStatus.ACTIVE);
        job1.setViewsCount(142);
        job1 = jobRepository.save(job1);

        Job job2 = new Job();
        job2.setEmployer(employer);
        job2.setTitle("React Frontend Developer");
        job2.setCompanyName("TechCorp Solutions");
        job2.setDescription("We are looking for a creative and detail-oriented Frontend Developer to craft sleek web portals with modern React and CSS.");
        job2.setRequirements("3+ years experience with React.js, modern CSS, state management, and responsive layouts. Experience integrating REST APIs.");
        job2.setResponsibilities("Build reusable React components. Collaborate with UX designers to translate Figma mockups into pixel-perfect pages.");
        job2.setCategory("Software Development");
        job2.setJobType(JobType.REMOTE);
        job2.setLocation("Remote / US");
        job2.setIsRemote(true);
        job2.setSalaryMin(new BigDecimal("90000"));
        job2.setSalaryMax(new BigDecimal("125000"));
        job2.setSalaryCurrency("USD");
        job2.setExperienceLevel("Mid Level");
        job2.setStatus(JobStatus.ACTIVE);
        job2.setViewsCount(98);
        job2 = jobRepository.save(job2);

        Job job3 = new Job();
        job3.setEmployer(employer);
        job3.setTitle("DevOps & Cloud Infrastructure Specialist");
        job3.setCompanyName("TechCorp Solutions");
        job3.setDescription("Help us streamline deployments, improve uptime, and maintain automated CI/CD workflows on AWS and Docker environments.");
        job3.setRequirements("Experience with AWS, Docker, Kubernetes, Linux sysadmin, and GitHub Actions.");
        job3.setResponsibilities("Maintain cloud infrastructure, monitor system performance, automate deployments.");
        job3.setCategory("DevOps & Cloud");
        job3.setJobType(JobType.CONTRACT);
        job3.setLocation("Austin, TX");
        job3.setIsRemote(false);
        job3.setSalaryMin(new BigDecimal("100000"));
        job3.setSalaryMax(new BigDecimal("130000"));
        job3.setSalaryCurrency("USD");
        job3.setExperienceLevel("Mid Level");
        job3.setStatus(JobStatus.ACTIVE);
        job3.setViewsCount(64);
        jobRepository.save(job3);

        // 4. Freelance Projects
        FreelanceProject project1 = new FreelanceProject();
        project1.setClient(employer);
        project1.setTitle("E-Commerce Dashboard Redesign & React Migration");
        project1.setDescription("We need an experienced frontend developer to redesign our merchant analytics dashboard and migrate existing legacy templates to clean, modular React components.");
        project1.setCategory("Web & Mobile");
        project1.setProjectType(ProjectType.FIXED);
        project1.setBudgetMin(new BigDecimal("3000"));
        project1.setBudgetMax(new BigDecimal("4500"));
        project1.setDeadline(LocalDate.now().plusDays(30));
        project1.setDuration("1 month");
        project1.setSkillsRequired("React.js, Tailwind CSS, REST APIs, Chart.js");
        project1.setStatus(ProjectStatus.OPEN);
        project1.setViewsCount(85);
        project1 = projectRepository.save(project1);

        FreelanceProject project2 = new FreelanceProject();
        project2.setClient(employer);
        project2.setTitle("Spring Boot Payment Gateway Integration");
        project2.setDescription("Looking for a skilled backend Java developer to implement Stripe & PayPal webhooks, subscription billing logic, and audit logging into an existing Spring Boot application.");
        project2.setCategory("Backend Development");
        project2.setProjectType(ProjectType.HOURLY);
        project2.setBudgetMin(new BigDecimal("50"));
        project2.setBudgetMax(new BigDecimal("80"));
        project2.setDeadline(LocalDate.now().plusDays(20));
        project2.setDuration("2-3 weeks");
        project2.setSkillsRequired("Java, Spring Boot, MySQL, REST APIs, Security");
        project2.setStatus(ProjectStatus.OPEN);
        project2.setViewsCount(112);
        projectRepository.save(project2);

        // 5. Job Application
        JobApplication app = new JobApplication();
        app.setJob(job1);
        app.setApplicant(jobSeeker);
        app.setCoverLetter("Dear TechCorp Hiring Team,\n\nI am thrilled to apply for the Senior Full Stack Java Engineer role. Over the past 3 years I have developed scalable web solutions with Spring Boot and React. I look forward to contributing to your team.");
        app.setResumeUrl("https://alexmorgan.dev/resume.pdf");
        app.setStatus(ApplicationStatus.REVIEWING);
        applicationRepository.save(app);

        // 6. Proposal
        Proposal prop = new Proposal();
        prop.setProject(project1);
        prop.setFreelancer(freelancer);
        prop.setCoverLetter("Hi TechCorp Team,\n\nI have extensive experience redesigning dashboards and building high-performance React component libraries with clean state management. I can deliver this project within 20 days with comprehensive documentation.");
        prop.setBidAmount(new BigDecimal("3500"));
        prop.setEstimatedDays(20);
        prop.setStatus(ProposalStatus.PENDING);
        proposalRepository.save(prop);

        logger.info("Sample marketplace data successfully initialized!");
    }

    private void ensureDemoUserPasswords() {
        String[] demoEmails = {
                "admin@marketplace.com",
                "techcorp@employer.com",
                "sarah.dev@freelancer.com",
                "alex.seeker@jobseeker.com"
        };
        for (String email : demoEmails) {
            userRepository.findByEmail(email).ifPresent(user -> {
                // Ensure password matches BCrypt password123
                if (!passwordEncoder.matches("password123", user.getPassword())) {
                    user.setPassword(passwordEncoder.encode("password123"));
                    userRepository.save(user);
                    logger.info("Updated password hash for {}", email);
                }
            });
        }
    }
}
