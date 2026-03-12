package com.dentalclinic.controller;

import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Billing;
import com.dentalclinic.model.Visit;
import com.dentalclinic.service.AppointmentService;
import com.dentalclinic.service.BillingService;
import com.dentalclinic.service.ServiceService;
import com.dentalclinic.service.VisitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Visit> create(@RequestBody Visit visit) {
        return new ResponseEntity<>(visitService.create(visit), HttpStatus.CREATED);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getByAppointmentId(@PathVariable Long appointmentId) {
        Optional<Visit> visit = visitService.findByAppointmentId(appointmentId);
        if (visit.isPresent()) {
            return ResponseEntity.ok(visit.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No visit record found for appointment " + appointmentId));
    }

    @PostMapping("/{appointmentId}/complete")
    public ResponseEntity<?> completeVisit(@PathVariable Long appointmentId) {
        Appointment appt = appointmentService.findById(appointmentId);
        Appointment statusUpdate = new Appointment();
        statusUpdate.setStatus("Completed");
        appointmentService.update(appointmentId, statusUpdate);

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

        return ResponseEntity.ok(Map.of("message", "Visit completed."));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}
