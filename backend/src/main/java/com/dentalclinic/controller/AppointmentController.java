package com.dentalclinic.controller;

import com.dentalclinic.model.Appointment;
import com.dentalclinic.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dentalclinic.dto.AppointmentRequestDTO;
import com.dentalclinic.dto.AppointmentResponseDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<AppointmentResponseDTO> getAll() {
        return service.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AppointmentResponseDTO getById(@PathVariable Long id) {
        Appointment appointment = service.findById(id);
        return convertToResponseDTO(appointment);
    }

    @GetMapping("/patient/{patientId}")
    public List<AppointmentResponseDTO> getByPatient(@PathVariable Long patientId) {
        return service.findByPatientId(patientId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/dentist/{dentistId}")
    public List<AppointmentResponseDTO> getByDentist(@PathVariable Long dentistId,
                                                     @RequestParam(required = false) String date) {
        LocalDate d = date != null ? LocalDate.parse(date) : null;
        return service.findByDentistAndDate(dentistId, d).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppointmentRequestDTO appointmentDTO) {
        try {
            Appointment appointment = convertToEntity(appointmentDTO);
            Appointment created = service.create(appointment);
            return new ResponseEntity<>(convertToResponseDTO(created), HttpStatus.CREATED);
        } catch (AppointmentService.ConflictException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AppointmentRequestDTO appointmentDTO) {
        try {
            Appointment appointment = convertToEntity(appointmentDTO);
            Appointment updated = service.update(id, appointment);
            return ResponseEntity.ok(convertToResponseDTO(updated));
        } catch (AppointmentService.ConflictException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException ex) {
        if (ex instanceof AppointmentService.ConflictException) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
    private Appointment convertToEntity(AppointmentRequestDTO dto) {
        Appointment appointment = new Appointment();
        appointment.setPatientId(dto.getPatientId());
        appointment.setDentistId(dto.getDentistId());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setDuration(dto.getDuration());

        appointment.setStatus(dto.getStatus() != null ? dto.getStatus() : "Scheduled");
        appointment.setNotes(dto.getNotes());

        return appointment;
    }

    private AppointmentResponseDTO convertToResponseDTO(Appointment appointment) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setAppointmentId(appointment.getAppointmentId());
        dto.setPatientId(appointment.getPatientId());
        dto.setDentistId(appointment.getDentistId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setDuration(appointment.getDuration());
        dto.setStatus(appointment.getStatus());
        dto.setNotes(appointment.getNotes());

        if (appointment.getPatient() != null) {
            dto.setPatientName(appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName());
        }
        if (appointment.getDentist() != null) {
            dto.setDentistName(appointment.getDentist().getFirstName() + " " + appointment.getDentist().getLastName());
        }

        return dto;
    }
}
