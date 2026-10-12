package com.marketplace.service;

import com.marketplace.dto.AuthRequest;
import com.marketplace.dto.AuthResponse;
import com.marketplace.dto.RegisterRequest;
import com.marketplace.dto.UserDto;
import com.marketplace.entity.Role;
import com.marketplace.entity.User;
import com.marketplace.entity.UserProfile;
import com.marketplace.entity.UserStatus;
import com.marketplace.exception.BadRequestException;
import com.marketplace.repository.UserProfileRepository;
import com.marketplace.repository.UserRepository;
import com.marketplace.security.JwtTokenProvider;
import com.marketplace.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final DtoMapper dtoMapper;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       DtoMapper dtoMapper) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + req.getEmail() + " already exists");
        }

        Role assignedRole = req.getRole();
        if (assignedRole == null || assignedRole == Role.ADMIN) {
            // Default to JOB_SEEKER if unspecified or prevent self-admin creation via public registration
            assignedRole = (assignedRole == Role.ADMIN) ? Role.JOB_SEEKER : req.getRole();
        }

        User user = new User();
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName().trim());
        user.setRole(assignedRole);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        // Initialize user profile
        UserProfile profile = new UserProfile(savedUser);
        profile.setHeadline(assignedRole == Role.FREELANCER ? "Freelance Professional" :
                             assignedRole == Role.EMPLOYER ? "Hiring Manager" : "Job Seeker");
        userProfileRepository.save(profile);
        savedUser.setProfile(profile);

        // Generate token
        String token = tokenProvider.generateTokenFromEmail(
                savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name()
        );

        return new AuthResponse(token, dtoMapper.toUserDto(savedUser));
    }

    @Transactional
    public AuthResponse login(AuthRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().trim().toLowerCase(), req.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BadRequestException("User record not found"));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new BadRequestException("This account has been suspended by an administrator");
        }

        return new AuthResponse(token, dtoMapper.toUserDto(user));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BadRequestException("User record not found"));
        return dtoMapper.toUserDto(user);
    }
}
