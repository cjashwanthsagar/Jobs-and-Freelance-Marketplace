package com.marketplace.controller;

import com.marketplace.dto.ApiResponse;
import com.marketplace.dto.JobCreateRequest;
import com.marketplace.dto.JobDto;
import com.marketplace.entity.JobType;
import com.marketplace.entity.Role;
import com.marketplace.security.UserPrincipal;
import com.marketplace.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobDto>>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean isRemote,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<JobDto> jobs = jobService.getJobs(keyword, category, jobType, location, isRemote, minSalary, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Jobs retrieved successfully", jobs));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<JobDto>>> searchJobs(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobDto> jobs = jobService.searchJobs(q, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Job search results", jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable Long id) {
        JobDto job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok("Job details retrieved", job));
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobDto>> createJob(@AuthenticationPrincipal UserPrincipal principal,
                                                         @Valid @RequestBody JobCreateRequest req) {
        JobDto job = jobService.createJob(principal.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job posted successfully", job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody JobCreateRequest req) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        JobDto updated = jobService.updateJob(principal.getId(), id, req, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable Long id) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        jobService.deleteJob(principal.getId(), id, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted successfully", null));
    }

    @GetMapping("/employer/my")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<JobDto>>> getMyPostedJobs(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobDto> jobs = jobService.getEmployerJobs(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok("Employer jobs retrieved", jobs));
    }
}
