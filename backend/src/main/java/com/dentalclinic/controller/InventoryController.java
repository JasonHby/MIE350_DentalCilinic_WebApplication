package com.dentalclinic.controller;

import com.dentalclinic.model.Inventory;
import com.dentalclinic.model.InventoryLog;
import com.dentalclinic.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Inventory> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Inventory getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/low-stock")
    public List<Inventory> getLowStock() {
        return service.findLowStock();
    }

    @PostMapping
    public ResponseEntity<Inventory> create(@RequestBody Inventory item) {
        return new ResponseEntity<>(service.create(item), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id, @RequestBody Inventory item) {
        return service.update(id, item);
    }

    @PutMapping("/{id}/restock")
    public Inventory restock(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        int quantity = (Integer) body.get("quantity");
        String supplier = (String) body.getOrDefault("supplier", null);
        return service.restock(id, quantity, supplier);
    }

    @PutMapping("/{id}/consume")
    public Inventory consume(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        int quantity = (Integer) body.get("quantity");
        String reason = (String) body.getOrDefault("reason", null);
        return service.consume(id, quantity, reason);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public List<InventoryLog> getHistory(@RequestParam(required = false) Long itemId,
                                          @RequestParam(required = false) String startDate,
                                          @RequestParam(required = false) String endDate) {
        if (itemId != null) {
            return service.getHistoryByItem(itemId);
        }
        if (startDate != null && endDate != null) {
            return service.getHistoryByDateRange(
                    LocalDateTime.parse(startDate + "T00:00:00"),
                    LocalDateTime.parse(endDate + "T23:59:59"));
        }
        return service.getAllHistory();
    }

    @PostMapping("/history")
    public ResponseEntity<InventoryLog> writeHistory(@RequestBody Map<String, Object> body) {
        Long itemId = Long.valueOf(body.get("itemId").toString());
        String changeType = (String) body.get("changeType");
        int quantityChanged = Integer.parseInt(body.get("quantityChanged").toString());
        int previousQty = Integer.parseInt(body.get("previousQty").toString());
        int newQty = Integer.parseInt(body.get("newQty").toString());
        String reason = (String) body.getOrDefault("reason", "");
        InventoryLog log = service.writeLog(itemId, changeType, quantityChanged, previousQty, newQty, reason);
        return new ResponseEntity<>(log, HttpStatus.CREATED);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}
