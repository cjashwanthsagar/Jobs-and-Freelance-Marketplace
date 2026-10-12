package com.marketplace.controller;

import com.marketplace.dto.ApiResponse;
import com.marketplace.dto.ApplicationCreateRequest;
import com.marketplace.dto.ApplicationDto;
import com.marketplace.dto.StatusUpdateRequest;
import com.marketplace.entity.Role;
import com.marketplace.security.UserPrincipal;
import com.marketplace.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/applications")
    public ResponseEntity<ApiResponse<ApplicationDto>> apply(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ApplicationCreateRequest req
    ) {
        ApplicationDto dto = applicationService.apply(principal.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job application submitted successfully", dto));
    }

    @GetMapping("/applications/my")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ApplicationDto> applications = applicationService.getMyApplications(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("User applications retrieved", applications));
    }

    @GetMapping("/jobs/{jobId}/applications")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getJobApplications(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId
    ) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        List<ApplicationDto> applications = applicationService.getJobApplications(principal.getId(), jobId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Applicants retrieved for job", applications));
    }

    @GetMapping("/applications/employer/all")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getAllEmployerApplications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ApplicationDto> applications = applicationService.getEmployerApplications(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All received applicants retrieved", applications));
    }

    @PutMapping("/applications/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateApplicationStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest req
    ) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        ApplicationDto updated = applicationService.updateStatus(principal.getId(), id, req.getStatus(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated to " + req.getStatus(), updated));
    }
}
