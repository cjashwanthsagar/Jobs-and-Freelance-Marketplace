package com.marketplace.controller;

import com.marketplace.dto.ApiResponse;
import com.marketplace.dto.ProposalCreateRequest;
import com.marketplace.dto.ProposalDto;
import com.marketplace.dto.StatusUpdateRequest;
import com.marketplace.entity.Role;
import com.marketplace.security.UserPrincipal;
import com.marketplace.service.ProposalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProposalController {

    private final ProposalService proposalService;

    public ProposalController(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    @PostMapping("/proposals")
    public ResponseEntity<ApiResponse<ProposalDto>> submitProposal(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProposalCreateRequest req
    ) {
        ProposalDto dto = proposalService.submitProposal(principal.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Proposal submitted successfully", dto));
    }

    @GetMapping("/proposals/my")
    public ResponseEntity<ApiResponse<List<ProposalDto>>> getMyProposals(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProposalDto> proposals = proposalService.getMyProposals(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Freelancer proposals retrieved", proposals));
    }

    @GetMapping("/projects/{projectId}/proposals")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProposalDto>>> getProjectProposals(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long projectId
    ) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        List<ProposalDto> proposals = proposalService.getProjectProposals(principal.getId(), projectId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Project proposals retrieved", proposals));
    }

    @GetMapping("/proposals/client/all")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProposalDto>>> getAllClientProposals(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProposalDto> proposals = proposalService.getClientProposals(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All proposals received by client retrieved", proposals));
    }

    @PutMapping("/proposals/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProposalDto>> updateProposalStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest req
    ) {
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        ProposalDto updated = proposalService.updateStatus(principal.getId(), id, req.getStatus(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Proposal status updated to " + req.getStatus(), updated));
    }
}
