package com.marketplace.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProposalCreateRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Cover letter is required")
    private String coverLetter;

    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "1.00", message = "Bid amount must be at least 1.00")
    private BigDecimal bidAmount;

    @NotNull(message = "Estimated days is required")
    @Min(value = 1, message = "Estimated days must be at least 1")
    private Integer estimatedDays;

    public ProposalCreateRequest() {}

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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
}
