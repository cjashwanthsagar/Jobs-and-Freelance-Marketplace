package com.marketplace.service;

import com.marketplace.dto.ProjectCreateRequest;
import com.marketplace.dto.ProjectDto;
import com.marketplace.entity.*;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.exception.UnauthorizedException;
import com.marketplace.repository.FreelanceProjectRepository;
import com.marketplace.repository.ProposalRepository;
import com.marketplace.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class ProjectService {

    private final FreelanceProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    public ProjectService(FreelanceProjectRepository projectRepository,
                          ProposalRepository proposalRepository,
                          UserRepository userRepository,
                          DtoMapper dtoMapper) {
        this.projectRepository = projectRepository;
        this.proposalRepository = proposalRepository;
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public Page<ProjectDto> getProjects(String keyword, String category, ProjectType projectType,
                                        BigDecimal minBudget, Pageable pageable) {
        Page<FreelanceProject> projects = projectRepository.filterProjects(ProjectStatus.OPEN, keyword, category, projectType, minBudget, pageable);
        return projects.map(p -> {
            long count = proposalRepository.countByProjectId(p.getId());
            return dtoMapper.toProjectDto(p, count);
        });
    }

    @Transactional
    public ProjectDto getProjectById(Long id) {
        FreelanceProject project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance project not found with id: " + id));

        // Increment views count
        project.setViewsCount(project.getViewsCount() + 1);
        projectRepository.save(project);

        long count = proposalRepository.countByProjectId(project.getId());
        return dtoMapper.toProjectDto(project, count);
    }

    @Transactional(readOnly = true)
    public Page<ProjectDto> searchProjects(String query, Pageable pageable) {
        Page<FreelanceProject> projects = projectRepository.searchProjects(ProjectStatus.OPEN, query, pageable);
        return projects.map(p -> {
            long count = proposalRepository.countByProjectId(p.getId());
            return dtoMapper.toProjectDto(p, count);
        });
    }

    @Transactional(readOnly = true)
    public Page<ProjectDto> getClientProjects(Long clientId, Pageable pageable) {
        Page<FreelanceProject> projects = projectRepository.findByClientId(clientId, pageable);
        return projects.map(p -> {
            long count = proposalRepository.countByProjectId(p.getId());
            return dtoMapper.toProjectDto(p, count);
        });
    }

    @Transactional
    public ProjectDto createProject(Long clientId, ProjectCreateRequest req) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + clientId));

        if (client.getRole() != Role.EMPLOYER && client.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only Employers/Clients and Administrators can publish freelance projects");
        }

        FreelanceProject project = new FreelanceProject();
        project.setClient(client);
        project.setTitle(req.getTitle().trim());
        project.setDescription(req.getDescription());
        project.setCategory(req.getCategory());
        project.setProjectType(req.getProjectType());
        project.setBudgetMin(req.getBudgetMin());
        project.setBudgetMax(req.getBudgetMax());
        project.setDeadline(req.getDeadline());
        project.setDuration(req.getDuration());
        project.setSkillsRequired(req.getSkillsRequired());
        project.setStatus(ProjectStatus.OPEN);

        FreelanceProject saved = projectRepository.save(project);
        return dtoMapper.toProjectDto(saved, 0L);
    }

    @Transactional
    public ProjectDto updateProject(Long currentUserId, Long projectId, ProjectCreateRequest req, boolean isAdmin) {
        FreelanceProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance project not found with id: " + projectId));

        if (!isAdmin && !project.getClient().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to edit this project");
        }

        project.setTitle(req.getTitle().trim());
        project.setDescription(req.getDescription());
        project.setCategory(req.getCategory());
        project.setProjectType(req.getProjectType());
        project.setBudgetMin(req.getBudgetMin());
        project.setBudgetMax(req.getBudgetMax());
        project.setDeadline(req.getDeadline());
        project.setDuration(req.getDuration());
        project.setSkillsRequired(req.getSkillsRequired());

        FreelanceProject updated = projectRepository.save(project);
        long count = proposalRepository.countByProjectId(updated.getId());
        return dtoMapper.toProjectDto(updated, count);
    }

    @Transactional
    public void deleteProject(Long currentUserId, Long projectId, boolean isAdmin) {
        FreelanceProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance project not found with id: " + projectId));

        if (!isAdmin && !project.getClient().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to delete this project");
        }

        projectRepository.delete(project);
    }
}
