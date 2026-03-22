package com.dentalclinic.service;

import com.dentalclinic.model.Patient;
import com.dentalclinic.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PatientService {

    private final PatientRepository repo;

    public PatientService(PatientRepository repo) {
        this.repo = repo;
    }

    public List<Patient> findAll() {
        return repo.findAll();
    }

    public Patient findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id " + id));
    }

    public List<Patient> searchByName(String name) {
        return repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

    public Patient create(Patient patient) {
        if (patient.getRegistrationDate() == null) {
            patient.setRegistrationDate(LocalDate.now());
        }
        return repo.save(patient);
    }

    public Patient update(Long id, Patient updated) {
        Patient existing = findById(id);
        if (updated.getFirstName() != null) existing.setFirstName(updated.getFirstName());
        if (updated.getLastName() != null) existing.setLastName(updated.getLastName());
        if (updated.getDateOfBirth() != null) existing.setDateOfBirth(updated.getDateOfBirth());
        if (updated.getGender() != null) existing.setGender(updated.getGender());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getMedicalHistory() != null) existing.setMedicalHistory(updated.getMedicalHistory());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Patient not found with id " + id);
        }
        repo.deleteById(id);
    }
}
