package com.marketplace.controller;

import com.marketplace.dto.ApiResponse;
import com.marketplace.dto.ProjectCreateRequest;
import com.marketplace.dto.ProjectDto;
import com.marketplace.entity.ProjectType;
import com.marketplace.entity.Role;
import com.marketplace.security.UserPrincipal;
import com.marketplace.service.ProjectService;
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
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProjectDto>>> getProjects(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProjectType projectType,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProjectDto> projects = projectService.getProjects(keyword, category, projectType, minBudget, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Freelance projects retrieved", projects));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProjectDto>>> searchProjects(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProjectDto> projects = projectService.searchProjects(q, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Project search results", projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable Long id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.ok("Project details retrieved", project));
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProjectCreateRequest req
    ) {
        ProjectDto project = projectService.createProject(principal.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Freelance project published successfully", project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ProjectCreateRequest req
    ) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        ProjectDto updated = projectService.updateProject(principal.getId(), id, req, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        projectService.deleteProject(principal.getId(), id, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted successfully", null));
    }

    @GetMapping("/client/my")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<ProjectDto>>> getMyProjects(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProjectDto> projects = projectService.getClientProjects(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok("Client projects retrieved", projects));
    }
}
