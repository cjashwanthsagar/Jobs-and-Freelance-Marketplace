package com.marketplace.controller;

import com.marketplace.dto.*;
import com.marketplace.entity.Role;
import com.marketplace.entity.UserStatus;
import com.marketplace.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserDto> users = adminService.getAllUsers(role, status, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved successfully", users));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest req
    ) {
        UserDto updated = adminService.updateUserStatus(id, req.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("User status updated to " + req.getStatus(), updated));
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<Page<JobDto>>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobDto> jobs = adminService.getAllJobs(pageable);
        return ResponseEntity.ok(ApiResponse.ok("Admin jobs retrieved", jobs));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<Page<ProjectDto>>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProjectDto> projects = adminService.getAllProjects(pageable);
        return ResponseEntity.ok(ApiResponse.ok("Admin projects retrieved", projects));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        AdminStatsDto stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.ok("Platform statistics retrieved", stats));
    }
}
