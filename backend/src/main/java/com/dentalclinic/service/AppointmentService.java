package com.dentalclinic.service;

import com.dentalclinic.model.Appointment;
import com.dentalclinic.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    public List<Appointment> findAll() {
        return repo.findAll();
    }

    public Appointment findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }

    public List<Appointment> findByPatientId(Long patientId) {
        return repo.findByPatientId(patientId);
    }

    public List<Appointment> findByDentistAndDate(Long dentistId, LocalDate date) {
        if (date != null) {
            return repo.findByDentistIdAndAppointmentDate(dentistId, date);
        }
        return repo.findByDentistId(dentistId);
    }

    public Appointment create(Appointment appointment) {
        if (appointment.getStatus() == null) {
            appointment.setStatus("Scheduled");
        }
        if (appointment.getDuration() == null) {
            appointment.setDuration(30);
        }
        checkConflict(appointment, null);
        return repo.save(appointment);
    }

    public Appointment update(Long id, Appointment updated) {
        Appointment existing = findById(id);
        if (updated.getPatientId() != null) existing.setPatientId(updated.getPatientId());
        if (updated.getDentistId() != null) existing.setDentistId(updated.getDentistId());
        if (updated.getAppointmentDate() != null) existing.setAppointmentDate(updated.getAppointmentDate());
        if (updated.getAppointmentTime() != null) existing.setAppointmentTime(updated.getAppointmentTime());
        if (updated.getDuration() != null) existing.setDuration(updated.getDuration());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getNotes() != null) existing.setNotes(updated.getNotes());

        if (!"Cancelled".equals(updated.getStatus()) && !"Completed".equals(updated.getStatus())) {
            if (updated.getAppointmentDate() != null || updated.getAppointmentTime() != null || updated.getDentistId() != null) {
                checkConflict(existing, id);
            }
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Appointment not found with id " + id);
        }
        repo.deleteById(id);
    }

    public long countByDate(LocalDate date) {
        return repo.countByAppointmentDate(date);
    }

    private void checkConflict(Appointment appt, Long excludeId) {
        LocalTime startTime = appt.getAppointmentTime();
        LocalTime endTime = startTime.plusMinutes(appt.getDuration() != null ? appt.getDuration() : 30);

        List<Appointment> existing = repo.findByDentistIdAndAppointmentDate(
                appt.getDentistId(), appt.getAppointmentDate());

        for (Appointment ex : existing) {
            if (excludeId != null && ex.getAppointmentId().equals(excludeId)) continue;
            if ("Cancelled".equals(ex.getStatus())) continue;

            LocalTime exStart = ex.getAppointmentTime();
            LocalTime exEnd = exStart.plusMinutes(ex.getDuration() != null ? ex.getDuration() : 30);

            if (startTime.isBefore(exEnd) && endTime.isAfter(exStart)) {
                throw new ConflictException(
                    "Dr. " + (ex.getDentist() != null ? ex.getDentist().getLastName() : appt.getDentistId()) +
                    " is unavailable at this time. There is a conflict with an existing appointment from " +
                    exStart + " to " + exEnd + ". Please select another slot.");
            }
        }
    }

    public static class ConflictException extends RuntimeException {
        public ConflictException(String message) {
            super(message);
        }
    }
}
