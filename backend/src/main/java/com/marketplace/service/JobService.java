package com.marketplace.service;

import com.marketplace.dto.JobCreateRequest;
import com.marketplace.dto.JobDto;
import com.marketplace.entity.*;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.exception.UnauthorizedException;
import com.marketplace.repository.JobApplicationRepository;
import com.marketplace.repository.JobRepository;
import com.marketplace.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    public JobService(JobRepository jobRepository,
                      JobApplicationRepository jobApplicationRepository,
                      UserRepository userRepository,
                      DtoMapper dtoMapper) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public Page<JobDto> getJobs(String keyword, String category, JobType jobType, String location,
                                Boolean isRemote, BigDecimal minSalary, Pageable pageable) {
        Page<Job> jobs = jobRepository.filterJobs(JobStatus.ACTIVE, keyword, category, jobType, location, isRemote, minSalary, pageable);
        return jobs.map(j -> {
            long count = jobApplicationRepository.countByJobId(j.getId());
            return dtoMapper.toJobDto(j, count);
        });
    }

    @Transactional
    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        // Increment views count
        job.setViewsCount(job.getViewsCount() + 1);
        jobRepository.save(job);

        long count = jobApplicationRepository.countByJobId(job.getId());
        return dtoMapper.toJobDto(job, count);
    }

    @Transactional(readOnly = true)
    public Page<JobDto> searchJobs(String query, Pageable pageable) {
        Page<Job> jobs = jobRepository.searchJobs(JobStatus.ACTIVE, query, pageable);
        return jobs.map(j -> {
            long count = jobApplicationRepository.countByJobId(j.getId());
            return dtoMapper.toJobDto(j, count);
        });
    }

    @Transactional(readOnly = true)
    public Page<JobDto> getEmployerJobs(Long employerId, Pageable pageable) {
        Page<Job> jobs = jobRepository.findByEmployerId(employerId, pageable);
        return jobs.map(j -> {
            long count = jobApplicationRepository.countByJobId(j.getId());
            return dtoMapper.toJobDto(j, count);
        });
    }

    @Transactional
    public JobDto createJob(Long employerId, JobCreateRequest req) {
        User employer = userRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + employerId));

        if (employer.getRole() != Role.EMPLOYER && employer.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only Employers and Administrators can post jobs");
        }

        Job job = new Job();
        job.setEmployer(employer);
        job.setTitle(req.getTitle().trim());
        job.setCompanyName(req.getCompanyName().trim());
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setResponsibilities(req.getResponsibilities());
        job.setCategory(req.getCategory());
        job.setJobType(req.getJobType());
        job.setLocation(req.getLocation().trim());
        job.setIsRemote(req.getIsRemote() != null ? req.getIsRemote() : false);
        job.setSalaryMin(req.getSalaryMin());
        job.setSalaryMax(req.getSalaryMax());
        job.setSalaryCurrency(req.getSalaryCurrency() != null ? req.getSalaryCurrency() : "USD");
        job.setExperienceLevel(req.getExperienceLevel() != null ? req.getExperienceLevel() : "Mid Level");
        job.setStatus(JobStatus.ACTIVE);

        Job saved = jobRepository.save(job);
        return dtoMapper.toJobDto(saved, 0L);
    }

    @Transactional
    public JobDto updateJob(Long currentUserId, Long jobId, JobCreateRequest req, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!isAdmin && !job.getEmployer().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to edit this job posting");
        }

        job.setTitle(req.getTitle().trim());
        job.setCompanyName(req.getCompanyName().trim());
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setResponsibilities(req.getResponsibilities());
        job.setCategory(req.getCategory());
        job.setJobType(req.getJobType());
        job.setLocation(req.getLocation().trim());
        job.setIsRemote(req.getIsRemote() != null ? req.getIsRemote() : false);
        job.setSalaryMin(req.getSalaryMin());
        job.setSalaryMax(req.getSalaryMax());
        if (req.getSalaryCurrency() != null) job.setSalaryCurrency(req.getSalaryCurrency());
        if (req.getExperienceLevel() != null) job.setExperienceLevel(req.getExperienceLevel());

        Job updated = jobRepository.save(job);
        long count = jobApplicationRepository.countByJobId(updated.getId());
        return dtoMapper.toJobDto(updated, count);
    }

    @Transactional
    public void deleteJob(Long currentUserId, Long jobId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!isAdmin && !job.getEmployer().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to delete this job posting");
        }

        jobRepository.delete(job);
    }
}
