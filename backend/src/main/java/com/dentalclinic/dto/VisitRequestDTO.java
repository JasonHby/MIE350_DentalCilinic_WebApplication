package com.dentalclinic.dto;

public class VisitRequestDTO {
    private Long appointmentId;
    private String chiefComplaint;
    private String findings;
    private String diagnosis;
    private String treatmentPlan;

    // Getters
    public Long getAppointmentId() { return appointmentId; }
    public String getChiefComplaint() { return chiefComplaint; }
    public String getFindings() { return findings; }
    public String getDiagnosis() { return diagnosis; }
    public String getTreatmentPlan() { return treatmentPlan; }

    // Setters
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public void setFindings(String findings) { this.findings = findings; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
}