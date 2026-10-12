package com.marketplace;

import com.marketplace.dto.JobCreateRequest;
import com.marketplace.dto.RegisterRequest;
import com.marketplace.entity.JobType;
import com.marketplace.entity.Role;
import com.marketplace.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MarketplaceApplicationTests {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("Context loads successfully")
    void contextLoads() {
        assertNotNull(passwordEncoder);
        assertNotNull(jwtTokenProvider);
    }

    @Test
    @DisplayName("BCrypt password encoder hashes and verifies passwords correctly")
    void testPasswordHashing() {
        String rawPassword = "password123";
        String encoded = passwordEncoder.encode(rawPassword);

        assertNotNull(encoded);
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
        assertFalse(passwordEncoder.matches("wrongpassword", encoded));
    }

    @Test
    @DisplayName("JWT Token Provider generates and validates tokens")
    void testJwtTokenGenerationAndValidation() {
        String email = "testuser@marketplace.com";
        Long userId = 99L;
        String role = "JOB_SEEKER";

        String token = jwtTokenProvider.generateTokenFromEmail(email, userId, role);
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(email, jwtTokenProvider.getEmailFromJwt(token));
    }

    @Test
    @DisplayName("RegisterRequest validation DTO properties")
    void testRegisterRequest() {
        RegisterRequest request = new RegisterRequest("Jane Doe", "jane@example.com", "secret123", Role.FREELANCER);
        assertEquals("Jane Doe", request.getFullName());
        assertEquals("jane@example.com", request.getEmail());
        assertEquals(Role.FREELANCER, request.getRole());
    }

    @Test
    @DisplayName("JobCreateRequest structure and types")
    void testJobCreateRequest() {
        JobCreateRequest jobReq = new JobCreateRequest();
        jobReq.setTitle("Senior Full Stack Engineer");
        jobReq.setCompanyName("Acme Corp");
        jobReq.setDescription("Building scalable web systems");
        jobReq.setCategory("Software Development");
        jobReq.setJobType(JobType.FULL_TIME);
        jobReq.setLocation("Remote");
        jobReq.setIsRemote(true);
        jobReq.setSalaryMin(new BigDecimal("100000"));
        jobReq.setSalaryMax(new BigDecimal("140000"));

        assertEquals("Senior Full Stack Engineer", jobReq.getTitle());
        assertTrue(jobReq.getIsRemote());
        assertEquals(JobType.FULL_TIME, jobReq.getJobType());
    }
}
