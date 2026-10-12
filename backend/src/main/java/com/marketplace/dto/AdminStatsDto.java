package com.marketplace.dto;

public class AdminStatsDto {
    private long totalUsers;
    private long totalJobSeekers;
    private long totalFreelancers;
    private long totalEmployers;
    private long totalJobs;
    private long activeJobs;
    private long totalProjects;
    private long openProjects;
    private long totalApplications;
    private long totalProposals;

    public AdminStatsDto() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalJobSeekers() {
        return totalJobSeekers;
    }

    public void setTotalJobSeekers(long totalJobSeekers) {
        this.totalJobSeekers = totalJobSeekers;
    }

    public long getTotalFreelancers() {
        return totalFreelancers;
    }

    public void setTotalFreelancers(long totalFreelancers) {
        this.totalFreelancers = totalFreelancers;
    }

    public long getTotalEmployers() {
        return totalEmployers;
    }

    public void setTotalEmployers(long totalEmployers) {
        this.totalEmployers = totalEmployers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getOpenProjects() {
        return openProjects;
    }

    public void setOpenProjects(long openProjects) {
        this.openProjects = openProjects;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalProposals() {
        return totalProposals;
    }

    public void setTotalProposals(long totalProposals) {
        this.totalProposals = totalProposals;
    }
}
