package com.dentalclinic.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponseDTO {
    private Long appointmentId;
    private Long patientId;
    private Long dentistId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private Integer duration;
    private String status;
    private String notes;
    private String patientName;
    private String dentistName;

    // Getters
    public Long getAppointmentId() { return appointmentId; }
    public Long getPatientId() { return patientId; }
    public Long getDentistId() { return dentistId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public Integer getDuration() { return duration; }
    public String getStatus() { return status; }
    public String getNotes() { return notes; }
    public String getPatientName() { return patientName; }
    public String getDentistName() { return dentistName; }

    // Setters
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setDentistId(Long dentistId) { this.dentistId = dentistId; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public void setStatus(String status) { this.status = status; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public void setDentistName(String dentistName) { this.dentistName = dentistName; }
}