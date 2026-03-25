package com.dentalclinic.dto;

import java.time.LocalDateTime;

public class VisitResponseDTO {
    private Long visitId;
    private Long appointmentId;
    private String chiefComplaint;
    private String findings;
    private String diagnosis;
    private String treatmentPlan;
    private LocalDateTime createdAt;
    private String patientName;
    private String dentistName;

    // Getters
    public Long getVisitId() { return visitId; }
    public Long getAppointmentId() { return appointmentId; }
    public String getChiefComplaint() { return chiefComplaint; }
    public String getFindings() { return findings; }
    public String getDiagnosis() { return diagnosis; }
    public String getTreatmentPlan() { return treatmentPlan; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getPatientName() { return patientName; }
    public String getDentistName() { return dentistName; }

    // Setters
    public void setVisitId(Long visitId) { this.visitId = visitId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public void setFindings(String findings) { this.findings = findings; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public void setDentistName(String dentistName) { this.dentistName = dentistName; }
}