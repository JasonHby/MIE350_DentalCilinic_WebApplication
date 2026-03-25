package com.dentalclinic.dto;

import java.time.LocalDate;

public class PatientResponseDTO {
    private Long patientId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String email;
    private String address;
    private String medicalHistory;
    private LocalDate registrationDate;

    // Getters
    public Long getPatientId() { return patientId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public String getGender() { return gender; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getAddress() { return address; }
    public String getMedicalHistory() { return medicalHistory; }
    public LocalDate getRegistrationDate() { return registrationDate; }

    // Setters
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setGender(String gender) { this.gender = gender; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setEmail(String email) { this.email = email; }
    public void setAddress(String address) { this.address = address; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }
}