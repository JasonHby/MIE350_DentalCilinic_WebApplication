package com.dentalclinic.controller;

import com.dentalclinic.dto.VisitRequestDTO;
import com.dentalclinic.dto.VisitResponseDTO;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Billing;
import com.dentalclinic.model.Visit;
import com.dentalclinic.service.AppointmentService;
import com.dentalclinic.service.BillingService;
import com.dentalclinic.service.ServiceService;
import com.dentalclinic.service.VisitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitService visitService;
    private final AppointmentService appointmentService;
    private final BillingService billingService;
    private final ServiceService serviceService;

    public VisitController(VisitService visitService, AppointmentService appointmentService,
                           BillingService billingService, ServiceService serviceService) {
        this.visitService = visitService;
        this.appointmentService = appointmentService;
        this.billingService = billingService;
        this.serviceService = serviceService;
    }

    @PostMapping
    public ResponseEntity<VisitResponseDTO> create(@RequestBody VisitRequestDTO visitDTO) {
        Visit visit = convertToEntity(visitDTO);
        Visit savedVisit = visitService.create(visit);
        return new ResponseEntity<>(convertToResponseDTO(savedVisit), HttpStatus.CREATED);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getByAppointmentId(@PathVariable Long appointmentId) {
        Optional<Visit> visit = visitService.findByAppointmentId(appointmentId);
        if (visit.isPresent()) {
            return ResponseEntity.ok(convertToResponseDTO(visit.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No visit record found for appointment " + appointmentId));
    }

    @PostMapping("/{appointmentId}/complete")
    @Transactional
    public ResponseEntity<?> completeVisit(@PathVariable Long appointmentId) {
        Appointment appt = appointmentService.findById(appointmentId);
        appt.setStatus("Completed");
        appointmentService.update(appointmentId, appt);

        Optional<Visit> visitOpt = visitService.findByAppointmentId(appointmentId);
        if (visitOpt.isPresent()) {
            double total = serviceService.calculateVisitTotal(visitOpt.get().getVisitId());
            Billing billing = new Billing();
            billing.setPatientId(appt.getPatientId());
            billing.setAppointmentId(appointmentId);
            billing.setTotalAmount(total);
            billing.setPaymentStatus("Pending");
            billing.setAmountPaid(0.0);

            Billing created = billingService.create(billing);

            return ResponseEntity.ok(Map.of(
                    "message", "Visit completed. Invoice #" + created.getBillId() + " generated.",
                    "billId", created.getBillId()));
        }

        return ResponseEntity.ok(Map.of("message", "Visit completed but no visit record found to generate billing."));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    private Visit convertToEntity(VisitRequestDTO dto) {
        Visit visit = new Visit();
        visit.setAppointmentId(dto.getAppointmentId());
        visit.setChiefComplaint(dto.getChiefComplaint());
        visit.setFindings(dto.getFindings());
        visit.setDiagnosis(dto.getDiagnosis());
        visit.setTreatmentPlan(dto.getTreatmentPlan());
        return visit;
    }

    private VisitResponseDTO convertToResponseDTO(Visit visit) {
        VisitResponseDTO dto = new VisitResponseDTO();
        dto.setVisitId(visit.getVisitId());
        dto.setAppointmentId(visit.getAppointmentId());
        dto.setChiefComplaint(visit.getChiefComplaint());
        dto.setFindings(visit.getFindings());
        dto.setDiagnosis(visit.getDiagnosis());
        dto.setTreatmentPlan(visit.getTreatmentPlan());
        dto.setCreatedAt(visit.getCreatedAt());

        if (visit.getAppointment() != null) {
            if (visit.getAppointment().getPatient() != null) {
                dto.setPatientName(visit.getAppointment().getPatient().getFirstName() + " " +
                        visit.getAppointment().getPatient().getLastName());
            }
            if (visit.getAppointment().getDentist() != null) {
                dto.setDentistName(visit.getAppointment().getDentist().getFirstName() + " " +
                        visit.getAppointment().getDentist().getLastName());
            }
        }
        return dto;
    }
}