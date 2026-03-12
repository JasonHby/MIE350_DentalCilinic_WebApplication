package com.dentalclinic.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clinic_service")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    @Column(nullable = false)
    private Long visitId;

    @Column(nullable = false)
    private String serviceName;

    @Column(length = 500)
    private String description;

    private Double unitCost;
    private Integer quantity;
    private Long linkedInventoryItemId;

    public Service() {}

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public Long getVisitId() { return visitId; }
    public void setVisitId(Long visitId) { this.visitId = visitId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getUnitCost() { return unitCost; }
    public void setUnitCost(Double unitCost) { this.unitCost = unitCost; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Long getLinkedInventoryItemId() { return linkedInventoryItemId; }
    public void setLinkedInventoryItemId(Long linkedInventoryItemId) { this.linkedInventoryItemId = linkedInventoryItemId; }
}
