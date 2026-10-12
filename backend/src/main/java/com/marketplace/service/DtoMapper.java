package com.marketplace.service;

import com.marketplace.dto.*;
import com.marketplace.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class DtoMapper {

    public UserDto toUserDto(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getProfile() != null) {
            dto.setProfile(toUserProfileDto(user.getProfile()));
        }

        if (user.getSkills() != null) {
            dto.setSkills(user.getSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        } else {
            dto.setSkills(Collections.emptyList());
        }

        return dto;
    }

    public UserProfileDto toUserProfileDto(UserProfile profile) {
        if (profile == null) return null;
        UserProfileDto dto = new UserProfileDto();
        dto.setId(profile.getId());
        dto.setHeadline(profile.getHeadline());
        dto.setBio(profile.getBio());
        dto.setLocation(profile.getLocation());
        dto.setPhone(profile.getPhone());
        dto.setWebsite(profile.getWebsite());
        dto.setGithub(profile.getGithub());
        dto.setLinkedin(profile.getLinkedin());
        dto.setHourlyRate(profile.getHourlyRate());
        dto.setExperienceYears(profile.getExperienceYears());
        dto.setEducation(profile.getEducation());
        dto.setAvatarUrl(profile.getAvatarUrl());
        return dto;
    }

    public JobDto toJobDto(Job job, long applicationsCount) {
        if (job == null) return null;
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        if (job.getEmployer() != null) {
            dto.setEmployerId(job.getEmployer().getId());
            dto.setEmployerName(job.getEmployer().getFullName());
        }
        dto.setTitle(job.getTitle());
        dto.setCompanyName(job.getCompanyName());
        dto.setDescription(job.getDescription());
        dto.setRequirements(job.getRequirements());
        dto.setResponsibilities(job.getResponsibilities());
        dto.setCategory(job.getCategory());
        dto.setJobType(job.getJobType());
        dto.setLocation(job.getLocation());
        dto.setIsRemote(job.getIsRemote());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setSalaryCurrency(job.getSalaryCurrency());
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setStatus(job.getStatus());
        dto.setViewsCount(job.getViewsCount());
        dto.setApplicationsCount(applicationsCount);
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());
        return dto;
    }

    public ApplicationDto toApplicationDto(JobApplication app) {
        if (app == null) return null;
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        if (app.getJob() != null) {
            dto.setJobId(app.getJob().getId());
            dto.setJobTitle(app.getJob().getTitle());
            dto.setCompanyName(app.getJob().getCompanyName());
            dto.setJobCategory(app.getJob().getCategory());
            dto.setJobLocation(app.getJob().getLocation());
        }
        if (app.getApplicant() != null) {
            dto.setApplicantId(app.getApplicant().getId());
            dto.setApplicantName(app.getApplicant().getFullName());
            dto.setApplicantEmail(app.getApplicant().getEmail());
            if (app.getApplicant().getProfile() != null) {
                dto.setApplicantHeadline(app.getApplicant().getProfile().getHeadline());
                dto.setApplicantLocation(app.getApplicant().getProfile().getLocation());
                dto.setApplicantAvatarUrl(app.getApplicant().getProfile().getAvatarUrl());
            }
        }
        dto.setCoverLetter(app.getCoverLetter());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setStatus(app.getStatus());
        dto.setCreatedAt(app.getCreatedAt());
        return dto;
    }

    public ProjectDto toProjectDto(FreelanceProject project, long proposalsCount) {
        if (project == null) return null;
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        if (project.getClient() != null) {
            dto.setClientId(project.getClient().getId());
            dto.setClientName(project.getClient().getFullName());
        }
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCategory(project.getCategory());
        dto.setProjectType(project.getProjectType());
        dto.setBudgetMin(project.getBudgetMin());
        dto.setBudgetMax(project.getBudgetMax());
        dto.setDeadline(project.getDeadline());
        dto.setDuration(project.getDuration());
        dto.setSkillsRequired(project.getSkillsRequired());
        dto.setStatus(project.getStatus());
        dto.setViewsCount(project.getViewsCount());
        dto.setProposalsCount(proposalsCount);
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }

    public ProposalDto toProposalDto(Proposal proposal) {
        if (proposal == null) return null;
        ProposalDto dto = new ProposalDto();
        dto.setId(proposal.getId());
        if (proposal.getProject() != null) {
            dto.setProjectId(proposal.getProject().getId());
            dto.setProjectTitle(proposal.getProject().getTitle());
            if (proposal.getProject().getClient() != null) {
                dto.setClientName(proposal.getProject().getClient().getFullName());
            }
        }
        if (proposal.getFreelancer() != null) {
            dto.setFreelancerId(proposal.getFreelancer().getId());
            dto.setFreelancerName(proposal.getFreelancer().getFullName());
            dto.setFreelancerEmail(proposal.getFreelancer().getEmail());
            if (proposal.getFreelancer().getProfile() != null) {
                dto.setFreelancerHeadline(proposal.getFreelancer().getProfile().getHeadline());
                dto.setFreelancerLocation(proposal.getFreelancer().getProfile().getLocation());
                dto.setFreelancerAvatarUrl(proposal.getFreelancer().getProfile().getAvatarUrl());
            }
        }
        dto.setCoverLetter(proposal.getCoverLetter());
        dto.setBidAmount(proposal.getBidAmount());
        dto.setEstimatedDays(proposal.getEstimatedDays());
        dto.setStatus(proposal.getStatus());
        dto.setCreatedAt(proposal.getCreatedAt());
        return dto;
    }
}
