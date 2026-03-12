package com.dentalclinic.controller;

import com.dentalclinic.model.Billing;
import com.dentalclinic.service.BillingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService service;

    public BillingController(BillingService service) {
        this.service = service;
    }

    @GetMapping
    public List<Billing> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Billing getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<Billing> getByPatient(@PathVariable Long patientId) {
        return service.findByPatientId(patientId);
    }

    @GetMapping("/overdue")
    public List<Billing> getOverdue() {
        return service.findOverdue();
    }

    @PostMapping
    public ResponseEntity<Billing> create(@RequestBody Billing billing) {
        return new ResponseEntity<>(service.create(billing), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Billing update(@PathVariable Long id, @RequestBody Billing billing) {
        return service.update(id, billing);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}
