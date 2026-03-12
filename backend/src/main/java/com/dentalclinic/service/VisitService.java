package com.dentalclinic.service;

import com.dentalclinic.model.Visit;
import com.dentalclinic.repository.VisitRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VisitService {

    private final VisitRepository repo;

    public VisitService(VisitRepository repo) {
        this.repo = repo;
    }

    public Visit create(Visit visit) {
        return repo.save(visit);
    }

    public Optional<Visit> findByAppointmentId(Long appointmentId) {
        return repo.findByAppointmentId(appointmentId);
    }

    public Visit findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found with id " + id));
    }
}
