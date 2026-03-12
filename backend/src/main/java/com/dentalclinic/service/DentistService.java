package com.dentalclinic.service;

import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Dentist;
import com.dentalclinic.repository.AppointmentRepository;
import com.dentalclinic.repository.DentistRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class DentistService {

    private final DentistRepository repo;
    private final AppointmentRepository appointmentRepo;

    public DentistService(DentistRepository repo, AppointmentRepository appointmentRepo) {
        this.repo = repo;
        this.appointmentRepo = appointmentRepo;
    }

    public List<Dentist> findAll() {
        return repo.findAll();
    }

    public Dentist findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Dentist not found with id " + id));
    }

    public Dentist create(Dentist dentist) {
        return repo.save(dentist);
    }

    public Dentist update(Long id, Dentist updated) {
        Dentist existing = findById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setSpecialization(updated.getSpecialization());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setWorkingDays(updated.getWorkingDays());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Dentist not found with id " + id);
        }
        repo.deleteById(id);
    }

    public List<Dentist> findAvailable(LocalDate date) {
        String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        return repo.findAll().stream()
                .filter(d -> d.getWorkingDays() != null &&
                        d.getWorkingDays().toLowerCase().contains(dayOfWeek.toLowerCase()))
                .collect(Collectors.toList());
    }
}
