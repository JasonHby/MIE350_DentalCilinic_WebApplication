package com.dentalclinic.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_log")
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private String changeType; // Restock, Consume, Auto-Deducted by Visit

    private Integer quantityChanged;
    private Integer previousQty;
    private Integer newQty;
    private String reason;
    private LocalDateTime changedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "itemId", insertable = false, updatable = false)
    private Inventory inventory;

    public InventoryLog() {}

    @PrePersist
    public void prePersist() {
        if (changedAt == null) changedAt = LocalDateTime.now();
    }

    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public String getChangeType() { return changeType; }
    public void setChangeType(String changeType) { this.changeType = changeType; }
    public Integer getQuantityChanged() { return quantityChanged; }
    public void setQuantityChanged(Integer quantityChanged) { this.quantityChanged = quantityChanged; }
    public Integer getPreviousQty() { return previousQty; }
    public void setPreviousQty(Integer previousQty) { this.previousQty = previousQty; }
    public Integer getNewQty() { return newQty; }
    public void setNewQty(Integer newQty) { this.newQty = newQty; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
    public Inventory getInventory() { return inventory; }
    public void setInventory(Inventory inventory) { this.inventory = inventory; }
}
