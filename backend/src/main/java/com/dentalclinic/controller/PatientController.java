package com.dentalclinic.controller;

import com.dentalclinic.model.Patient;
import com.dentalclinic.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dentalclinic.dto.PatientRequestDTO;
import com.dentalclinic.dto.PatientResponseDTO;
import java.time.LocalDate;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @GetMapping
    public List<PatientResponseDTO> getAll() {
        return service.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public PatientResponseDTO getById(@PathVariable Long id) {
        Patient patient = service.findById(id);
        return convertToResponseDTO(patient);
    }

    @GetMapping("/search")
    public List<PatientResponseDTO> search(@RequestParam String name) {
        return service.searchByName(name).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<PatientResponseDTO> create(@RequestBody PatientRequestDTO patientDTO) {
        Patient patient = convertToEntity(patientDTO);
        patient.setRegistrationDate(LocalDate.now());
        Patient savedPatient = service.create(patient);
        return new ResponseEntity<>(convertToResponseDTO(savedPatient), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public PatientResponseDTO update(@PathVariable Long id, @RequestBody PatientRequestDTO patientDTO) {
        Patient patientToUpdate = convertToEntity(patientDTO);
        Patient updatedPatient = service.update(id, patientToUpdate);
        return convertToResponseDTO(updatedPatient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    private Patient convertToEntity(PatientRequestDTO dto) {
        Patient patient = new Patient();
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setMedicalHistory(dto.getMedicalHistory());
        return patient;
    }

    private PatientResponseDTO convertToResponseDTO(Patient patient) {
        PatientResponseDTO dto = new PatientResponseDTO();
        dto.setPatientId(patient.getPatientId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setPhone(patient.getPhone());
        dto.setEmail(patient.getEmail());
        dto.setAddress(patient.getAddress());
        dto.setMedicalHistory(patient.getMedicalHistory());
        dto.setRegistrationDate(patient.getRegistrationDate());
        return dto;
    }
}


