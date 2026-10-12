package com.marketplace.service;

import com.marketplace.dto.ProposalCreateRequest;
import com.marketplace.dto.ProposalDto;
import com.marketplace.entity.*;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.exception.UnauthorizedException;
import com.marketplace.repository.FreelanceProjectRepository;
import com.marketplace.repository.ProposalRepository;
import com.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final FreelanceProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    public ProposalService(ProposalRepository proposalRepository,
                           FreelanceProjectRepository projectRepository,
                           UserRepository userRepository,
                           DtoMapper dtoMapper) {
        this.proposalRepository = proposalRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public ProposalDto submitProposal(Long freelancerId, ProposalCreateRequest req) {
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer user not found"));

        FreelanceProject project = projectRepository.findById(req.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Freelance project not found with id: " + req.getProjectId()));

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("This freelance project is no longer accepting proposals");
        }

        if (project.getClient().getId().equals(freelancerId)) {
            throw new BadRequestException("Clients cannot submit proposals to their own projects");
        }

        if (proposalRepository.existsByProjectIdAndFreelancerId(project.getId(), freelancerId)) {
            throw new BadRequestException("You have already submitted a proposal for this project");
        }

        Proposal proposal = new Proposal();
        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setCoverLetter(req.getCoverLetter());
        proposal.setBidAmount(req.getBidAmount());
        proposal.setEstimatedDays(req.getEstimatedDays());
        proposal.setStatus(ProposalStatus.PENDING);

        Proposal saved = proposalRepository.save(proposal);
        return dtoMapper.toProposalDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ProposalDto> getMyProposals(Long freelancerId) {
        List<Proposal> proposals = proposalRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId);
        return proposals.stream().map(dtoMapper::toProposalDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProposalDto> getProjectProposals(Long currentUserId, Long projectId, boolean isAdmin) {
        FreelanceProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!isAdmin && !project.getClient().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to view proposals for this project");
        }

        List<Proposal> proposals = proposalRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        return proposals.stream().map(dtoMapper::toProposalDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProposalDto> getClientProposals(Long clientId) {
        List<Proposal> proposals = proposalRepository.findByClientId(clientId);
        return proposals.stream().map(dtoMapper::toProposalDto).collect(Collectors.toList());
    }

    @Transactional
    public ProposalDto updateStatus(Long currentUserId, Long proposalId, String newStatus, boolean isAdmin) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with id: " + proposalId));

        if (!isAdmin && !proposal.getProject().getClient().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to update this proposal status");
        }

        try {
            ProposalStatus status = ProposalStatus.valueOf(newStatus.toUpperCase());
            proposal.setStatus(status);
            Proposal updated = proposalRepository.save(proposal);
            return dtoMapper.toProposalDto(updated);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid proposal status: " + newStatus);
        }
    }
}
