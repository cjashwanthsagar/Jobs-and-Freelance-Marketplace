package com.marketplace.service;

import com.marketplace.dto.ApplicationCreateRequest;
import com.marketplace.dto.ApplicationDto;
import com.marketplace.entity.*;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.exception.UnauthorizedException;
import com.marketplace.repository.JobApplicationRepository;
import com.marketplace.repository.JobRepository;
import com.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    public ApplicationService(JobApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              DtoMapper dtoMapper) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public ApplicationDto apply(Long applicantId, ApplicationCreateRequest req) {
        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant user not found"));

        Job job = jobRepository.findById(req.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + req.getJobId()));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job listing is no longer accepting applications");
        }

        if (job.getEmployer().getId().equals(applicantId)) {
            throw new BadRequestException("Employers cannot apply to their own job postings");
        }

        if (applicationRepository.existsByJobIdAndApplicantId(job.getId(), applicantId)) {
            throw new BadRequestException("You have already submitted an application for this job");
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setApplicant(applicant);
        application.setCoverLetter(req.getCoverLetter());
        application.setResumeUrl(req.getResumeUrl());
        application.setStatus(ApplicationStatus.PENDING);

        JobApplication saved = applicationRepository.save(application);
        return dtoMapper.toApplicationDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getMyApplications(Long applicantId) {
        List<JobApplication> applications = applicationRepository.findByApplicantIdOrderByCreatedAtDesc(applicantId);
        return applications.stream().map(dtoMapper::toApplicationDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getJobApplications(Long currentUserId, Long jobId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!isAdmin && !job.getEmployer().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to view applicants for this job");
        }

        List<JobApplication> applications = applicationRepository.findByJobIdOrderByCreatedAtDesc(jobId);
        return applications.stream().map(dtoMapper::toApplicationDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getEmployerApplications(Long employerId) {
        List<JobApplication> applications = applicationRepository.findByEmployerId(employerId);
        return applications.stream().map(dtoMapper::toApplicationDto).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateStatus(Long currentUserId, Long applicationId, String newStatus, boolean isAdmin) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!isAdmin && !application.getJob().getEmployer().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to update this application status");
        }

        try {
            ApplicationStatus status = ApplicationStatus.valueOf(newStatus.toUpperCase());
            application.setStatus(status);
            JobApplication updated = applicationRepository.save(application);
            return dtoMapper.toApplicationDto(updated);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid application status: " + newStatus);
        }
    }
}
