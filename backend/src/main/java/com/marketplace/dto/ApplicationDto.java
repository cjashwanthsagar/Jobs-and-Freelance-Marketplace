package com.marketplace.dto;

import com.marketplace.entity.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String jobCategory;
    private String jobLocation;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantHeadline;
    private String applicantLocation;
    private String applicantAvatarUrl;
    private String coverLetter;
    private String resumeUrl;
    private ApplicationStatus status;
    private LocalDateTime createdAt;

    public ApplicationDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobCategory() {
        return jobCategory;
    }

    public void setJobCategory(String jobCategory) {
        this.jobCategory = jobCategory;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public Long getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(Long applicantId) {
        this.applicantId = applicantId;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public void setApplicantEmail(String applicantEmail) {
        this.applicantEmail = applicantEmail;
    }

    public String getApplicantHeadline() {
        return applicantHeadline;
    }

    public void setApplicantHeadline(String applicantHeadline) {
        this.applicantHeadline = applicantHeadline;
    }

    public String getApplicantLocation() {
        return applicantLocation;
    }

    public void setApplicantLocation(String applicantLocation) {
        this.applicantLocation = applicantLocation;
    }

    public String getApplicantAvatarUrl() {
        return applicantAvatarUrl;
    }

    public void setApplicantAvatarUrl(String applicantAvatarUrl) {
        this.applicantAvatarUrl = applicantAvatarUrl;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
