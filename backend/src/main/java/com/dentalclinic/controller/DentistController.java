package com.dentalclinic.controller;

import com.dentalclinic.model.Dentist;
import com.dentalclinic.service.DentistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dentists")
public class DentistController {

    private final DentistService service;

    public DentistController(DentistService service) {
        this.service = service;
    }

    @GetMapping
    public List<Dentist> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Dentist getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/available")
    public List<Dentist> getAvailable(@RequestParam String date) {
        return service.findAvailable(LocalDate.parse(date));
    }

    @PostMapping
    public ResponseEntity<Dentist> create(@RequestBody Dentist dentist) {
        return new ResponseEntity<>(service.create(dentist), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Dentist update(@PathVariable Long id, @RequestBody Dentist dentist) {
        return service.update(id, dentist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}
