package com.dentalclinic.repository;

import com.dentalclinic.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDentistIdAndAppointmentDate(Long dentistId, LocalDate date);

    List<Appointment> findByDentistId(Long dentistId);

    List<Appointment> findByAppointmentDate(LocalDate date);

    long countByAppointmentDate(LocalDate date);
}
