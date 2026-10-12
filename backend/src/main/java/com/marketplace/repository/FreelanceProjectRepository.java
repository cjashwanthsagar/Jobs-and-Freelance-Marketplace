package com.marketplace.repository;

import com.marketplace.entity.FreelanceProject;
import com.marketplace.entity.ProjectStatus;
import com.marketplace.entity.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FreelanceProjectRepository extends JpaRepository<FreelanceProject, Long> {
    Page<FreelanceProject> findByStatus(ProjectStatus status, Pageable pageable);
    Page<FreelanceProject> findByClientId(Long clientId, Pageable pageable);
    List<FreelanceProject> findTop6ByStatusOrderByCreatedAtDesc(ProjectStatus status);

    @Query("SELECT p FROM FreelanceProject p WHERE p.status = :status AND " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:projectType IS NULL OR p.projectType = :projectType) AND " +
           "(:minBudget IS NULL OR p.budgetMax >= :minBudget OR p.budgetMin >= :minBudget) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.skillsRequired) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<FreelanceProject> filterProjects(@Param("status") ProjectStatus status,
                                          @Param("keyword") String keyword,
                                          @Param("category") String category,
                                          @Param("projectType") ProjectType projectType,
                                          @Param("minBudget") BigDecimal minBudget,
                                          Pageable pageable);

    @Query("SELECT p FROM FreelanceProject p WHERE p.status = :status AND (" +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.skillsRequired) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<FreelanceProject> searchProjects(@Param("status") ProjectStatus status, @Param("q") String q, Pageable pageable);

    long countByStatus(ProjectStatus status);
    long countByClientId(Long clientId);
}
