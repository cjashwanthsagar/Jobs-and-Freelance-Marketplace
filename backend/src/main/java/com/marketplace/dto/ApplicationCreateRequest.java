package com.marketplace.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationCreateRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String coverLetter;
    private String resumeUrl;

    public ApplicationCreateRequest() {}

    public ApplicationCreateRequest(Long jobId, String coverLetter, String resumeUrl) {
        this.jobId = jobId;
        this.coverLetter = coverLetter;
        this.resumeUrl = resumeUrl;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
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
}
