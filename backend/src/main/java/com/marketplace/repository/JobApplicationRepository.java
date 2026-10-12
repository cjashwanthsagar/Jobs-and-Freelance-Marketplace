package com.marketplace.repository;

import com.marketplace.entity.ApplicationStatus;
import com.marketplace.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findByJobIdAndApplicantId(Long jobId, Long applicantId);
    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);
    
    List<JobApplication> findByJobIdOrderByCreatedAtDesc(Long jobId);
    List<JobApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);
    Page<JobApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId, Pageable pageable);

    @Query("SELECT a FROM JobApplication a WHERE a.job.employer.id = :employerId ORDER BY a.createdAt DESC")
    List<JobApplication> findByEmployerId(@Param("employerId") Long employerId);

    long countByApplicantId(Long applicantId);
    long countByApplicantIdAndStatus(Long applicantId, ApplicationStatus status);
    long countByJobEmployerId(Long employerId);
    long countByJobId(Long jobId);
    long countByStatus(ApplicationStatus status);
}
