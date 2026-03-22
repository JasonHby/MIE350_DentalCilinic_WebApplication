package com.dentalclinic.service;

import com.dentalclinic.model.Inventory;
import com.dentalclinic.model.InventoryLog;
import com.dentalclinic.repository.InventoryLogRepository;
import com.dentalclinic.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository repo;
    private final InventoryLogRepository logRepo;

    public InventoryService(InventoryRepository repo, InventoryLogRepository logRepo) {
        this.repo = repo;
        this.logRepo = logRepo;
    }

    public List<Inventory> findAll() {
        return repo.findAll();
    }

    public Inventory findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id " + id));
    }

    public List<Inventory> findLowStock() {
        return repo.findLowStock();
    }

    public Inventory create(Inventory item) {
        return repo.save(item);
    }

    @Transactional
    public Inventory update(Long id, Inventory updated) {
        Inventory existing = findById(id);
        if (updated.getItemName() != null) existing.setItemName(updated.getItemName());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getQuantity() != null) existing.setQuantity(updated.getQuantity());
        if (updated.getUnitPrice() != null) existing.setUnitPrice(updated.getUnitPrice());
        if (updated.getReorderLevel() != null) existing.setReorderLevel(updated.getReorderLevel());
        if (updated.getSupplier() != null) existing.setSupplier(updated.getSupplier());
        if (updated.getLastRestocked() != null) existing.setLastRestocked(updated.getLastRestocked());
        return repo.save(existing);
    }

    @Transactional
    public Inventory restock(Long id, int quantity, String supplier) {
        Inventory item = findById(id);
        int prevQty = item.getQuantity();
        item.setQuantity(prevQty + quantity);
        item.setLastRestocked(LocalDate.now());
        if (supplier != null) item.setSupplier(supplier);
        repo.save(item);

        String reason = supplier != null && !supplier.isBlank()
                ? "Restocked from " + supplier
                : "Manual restock";
        writeLog(id, "Restock", quantity, prevQty, item.getQuantity(), reason);
        return item;
    }

    @Transactional
    public Inventory consume(Long id, int quantity, String reason) {
        Inventory item = findById(id);
        int prevQty = item.getQuantity();
        int newQty = Math.max(0, prevQty - quantity);
        item.setQuantity(newQty);
        repo.save(item);

        writeLog(id, "Consume", quantity, prevQty, newQty, reason != null ? reason : "Manual consume");
        return item;
    }

    @Transactional
    public void autoDeduct(Long itemId, int quantity) {
        Inventory item = findById(itemId);
        int prevQty = item.getQuantity();
        int newQty = Math.max(0, prevQty - quantity);
        item.setQuantity(newQty);
        repo.save(item);

        writeLog(itemId, "Auto-Deducted by Visit", quantity, prevQty, newQty, "Service usage auto-deduction");
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Inventory item not found with id " + id);
        }
        repo.deleteById(id);
    }

    public long countLowStock() {
        return repo.countLowStock();
    }

    public List<InventoryLog> getHistoryByItem(Long itemId) {
        return logRepo.findByItemIdOrderByChangedAtDesc(itemId);
    }

    public List<InventoryLog> getAllHistory() {
        return logRepo.findAllByOrderByChangedAtDesc();
    }

    public List<InventoryLog> getHistoryByDateRange(LocalDateTime start, LocalDateTime end) {
        return logRepo.findByChangedAtBetweenOrderByChangedAtDesc(start, end);
    }

    public InventoryLog writeLog(Long itemId, String changeType, int quantityChanged,
                                  int previousQty, int newQty, String reason) {
        InventoryLog log = new InventoryLog();
        log.setItemId(itemId);
        log.setChangeType(changeType);
        log.setQuantityChanged(quantityChanged);
        log.setPreviousQty(previousQty);
        log.setNewQty(newQty);
        log.setReason(reason);
        log.setChangedAt(LocalDateTime.now());
        return logRepo.save(log);
    }
}
