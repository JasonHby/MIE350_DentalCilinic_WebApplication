package com.dentalclinic.service;

import com.dentalclinic.repository.ServiceRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository repo;
    private final InventoryService inventoryService;

    public ServiceService(ServiceRepository repo, InventoryService inventoryService) {
        this.repo = repo;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public com.dentalclinic.model.Service create(com.dentalclinic.model.Service service) {
        com.dentalclinic.model.Service saved = repo.save(service);

        if (service.getLinkedInventoryItemId() != null && service.getQuantity() != null) {
            inventoryService.autoDeduct(service.getLinkedInventoryItemId(), service.getQuantity());
        }

        return saved;
    }

    public List<com.dentalclinic.model.Service> findByVisitId(Long visitId) {
        return repo.findByVisitId(visitId);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Service not found with id " + id);
        }
        repo.deleteById(id);
    }

    public double calculateVisitTotal(Long visitId) {
        List<com.dentalclinic.model.Service> services = repo.findByVisitId(visitId);
        return services.stream()
                .mapToDouble(s -> (s.getUnitCost() != null ? s.getUnitCost() : 0) *
                                  (s.getQuantity() != null ? s.getQuantity() : 1))
                .sum();
    }
}
