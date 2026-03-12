package com.dentalclinic.repository;

import com.dentalclinic.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VisitRepository extends JpaRepository<Visit, Long> {
    Optional<Visit> findByAppointmentId(Long appointmentId);
}
