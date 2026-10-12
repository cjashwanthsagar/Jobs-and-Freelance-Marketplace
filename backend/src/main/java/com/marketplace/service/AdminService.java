package com.marketplace.service;

import com.marketplace.dto.AdminStatsDto;
import com.marketplace.dto.JobDto;
import com.marketplace.dto.ProjectDto;
import com.marketplace.dto.UserDto;
import com.marketplace.entity.*;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final FreelanceProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final DtoMapper dtoMapper;

    public AdminService(UserRepository userRepository,
                        JobRepository jobRepository,
                        JobApplicationRepository applicationRepository,
                        FreelanceProjectRepository projectRepository,
                        ProposalRepository proposalRepository,
                        DtoMapper dtoMapper) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.proposalRepository = proposalRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Role role, UserStatus status, String search, Pageable pageable) {
        Page<User> users = userRepository.searchUsers(role, status, search, pageable);
        return users.map(dtoMapper::toUserDto);
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, String newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            UserStatus status = UserStatus.valueOf(newStatus.toUpperCase());
            user.setStatus(status);
            User updated = userRepository.save(user);
            return dtoMapper.toUserDto(updated);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid user status: " + newStatus);
        }
    }

    @Transactional(readOnly = true)
    public Page<JobDto> getAllJobs(Pageable pageable) {
        Page<Job> jobs = jobRepository.findAll(pageable);
        return jobs.map(j -> {
            long count = applicationRepository.countByJobId(j.getId());
            return dtoMapper.toJobDto(j, count);
        });
    }

    @Transactional(readOnly = true)
    public Page<ProjectDto> getAllProjects(Pageable pageable) {
        Page<FreelanceProject> projects = projectRepository.findAll(pageable);
        return projects.map(p -> {
            long count = proposalRepository.countByProjectId(p.getId());
            return dtoMapper.toProjectDto(p, count);
        });
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalJobSeekers(userRepository.countByRole(Role.JOB_SEEKER));
        stats.setTotalFreelancers(userRepository.countByRole(Role.FREELANCER));
        stats.setTotalEmployers(userRepository.countByRole(Role.EMPLOYER));
        stats.setTotalJobs(jobRepository.count());
        stats.setActiveJobs(jobRepository.countByStatus(JobStatus.ACTIVE));
        stats.setTotalProjects(projectRepository.count());
        stats.setOpenProjects(projectRepository.countByStatus(ProjectStatus.OPEN));
        stats.setTotalApplications(applicationRepository.count());
        stats.setTotalProposals(proposalRepository.count());
        return stats;
    }
}
