package com.marketplace.dto;

import com.marketplace.entity.ProposalStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProposalDto {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private String clientName;
    private Long freelancerId;
    private String freelancerName;
    private String freelancerEmail;
    private String freelancerHeadline;
    private String freelancerLocation;
    private String freelancerAvatarUrl;
    private String coverLetter;
    private BigDecimal bidAmount;
    private Integer estimatedDays;
    private ProposalStatus status;
    private LocalDateTime createdAt;

    public ProposalDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getFreelancerId() {
        return freelancerId;
    }

    public void setFreelancerId(Long freelancerId) {
        this.freelancerId = freelancerId;
    }

    public String getFreelancerName() {
        return freelancerName;
    }

    public void setFreelancerName(String freelancerName) {
        this.freelancerName = freelancerName;
    }

    public String getFreelancerEmail() {
        return freelancerEmail;
    }

    public void setFreelancerEmail(String freelancerEmail) {
        this.freelancerEmail = freelancerEmail;
    }

    public String getFreelancerHeadline() {
        return freelancerHeadline;
    }

    public void setFreelancerHeadline(String freelancerHeadline) {
        this.freelancerHeadline = freelancerHeadline;
    }

    public String getFreelancerLocation() {
        return freelancerLocation;
    }

    public void setFreelancerLocation(String freelancerLocation) {
        this.freelancerLocation = freelancerLocation;
    }

    public String getFreelancerAvatarUrl() {
        return freelancerAvatarUrl;
    }

    public void setFreelancerAvatarUrl(String freelancerAvatarUrl) {
        this.freelancerAvatarUrl = freelancerAvatarUrl;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public Integer getEstimatedDays() {
        return estimatedDays;
    }

    public void setEstimatedDays(Integer estimatedDays) {
        this.estimatedDays = estimatedDays;
    }

    public ProposalStatus getStatus() {
        return status;
    }

    public void setStatus(ProposalStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
