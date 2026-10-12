package com.marketplace.repository;

import com.marketplace.entity.Proposal;
import com.marketplace.entity.ProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    Optional<Proposal> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    
    List<Proposal> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<Proposal> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);
    Page<Proposal> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId, Pageable pageable);

    @Query("SELECT pr FROM Proposal pr WHERE pr.project.client.id = :clientId ORDER BY pr.createdAt DESC")
    List<Proposal> findByClientId(@Param("clientId") Long clientId);

    long countByFreelancerId(Long freelancerId);
    long countByFreelancerIdAndStatus(Long freelancerId, ProposalStatus status);
    long countByProjectClientId(Long clientId);
    long countByProjectId(Long projectId);
    long countByStatus(ProposalStatus status);
}
