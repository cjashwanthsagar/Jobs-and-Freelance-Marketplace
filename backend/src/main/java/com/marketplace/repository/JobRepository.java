package com.marketplace.repository;

import com.marketplace.entity.Job;
import com.marketplace.entity.JobStatus;
import com.marketplace.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    Page<Job> findByEmployerId(Long employerId, Pageable pageable);
    List<Job> findTop6ByStatusOrderByCreatedAtDesc(JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
           "(:category IS NULL OR :category = '' OR LOWER(j.category) = LOWER(:category)) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:isRemote IS NULL OR j.isRemote = :isRemote) AND " +
           "(:minSalary IS NULL OR j.salaryMax >= :minSalary OR j.salaryMin >= :minSalary) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> filterJobs(@Param("status") JobStatus status,
                         @Param("keyword") String keyword,
                         @Param("category") String category,
                         @Param("jobType") JobType jobType,
                         @Param("location") String location,
                         @Param("isRemote") Boolean isRemote,
                         @Param("minSalary") BigDecimal minSalary,
                         Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND (" +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(j.companyName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(j.category) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Job> searchJobs(@Param("status") JobStatus status, @Param("q") String q, Pageable pageable);

    long countByStatus(JobStatus status);
    long countByEmployerId(Long employerId);
}
