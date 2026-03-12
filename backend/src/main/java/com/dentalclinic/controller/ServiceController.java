package com.dentalclinic.controller;

import com.dentalclinic.service.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService service;

    public ServiceController(ServiceService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<com.dentalclinic.model.Service> create(
            @RequestBody com.dentalclinic.model.Service svc) {
        return new ResponseEntity<>(service.create(svc), HttpStatus.CREATED);
    }

    @GetMapping("/visit/{visitId}")
    public List<com.dentalclinic.model.Service> getByVisit(@PathVariable Long visitId) {
        return service.findByVisitId(visitId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}
