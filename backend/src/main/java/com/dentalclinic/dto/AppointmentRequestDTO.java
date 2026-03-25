package com.dentalclinic.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentRequestDTO {
    private Long patientId;
    private Long dentistId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private Integer duration;
    private String status;
    private String notes;

    // Getters
    public Long getPatientId() { return patientId; }
    public Long getDentistId() { return dentistId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public Integer getDuration() { return duration; }
    public String getStatus() { return status; }
    public String getNotes() { return notes; }

    // Setters
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setDentistId(Long dentistId) { this.dentistId = dentistId; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public void setStatus(String status) { this.status = status; }
    public void setNotes(String notes) { this.notes = notes; }
}