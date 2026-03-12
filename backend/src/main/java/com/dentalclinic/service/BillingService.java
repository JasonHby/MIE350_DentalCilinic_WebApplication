package com.dentalclinic.service;

import com.dentalclinic.model.Billing;
import com.dentalclinic.repository.BillingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillingService {

    private final BillingRepository repo;

    public BillingService(BillingRepository repo) {
        this.repo = repo;
    }

    public List<Billing> findAll() {
        return repo.findAll();
    }

    public Billing findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id " + id));
    }

    public List<Billing> findByPatientId(Long patientId) {
        return repo.findByPatientId(patientId);
    }

    public List<Billing> findOverdue() {
        List<Billing> pending = repo.findByPaymentStatus("Pending");
        pending.forEach(b -> {
            if (b.getBillingDate() != null && b.getBillingDate().plusDays(30).isBefore(LocalDate.now())) {
                b.setPaymentStatus("Overdue");
                repo.save(b);
            }
        });
        List<Billing> overdue = repo.findByPaymentStatus("Overdue");
        return overdue;
    }

    public Billing create(Billing billing) {
        if (billing.getBillingDate() == null) {
            billing.setBillingDate(LocalDate.now());
        }
        if (billing.getPaymentStatus() == null) {
            billing.setPaymentStatus("Pending");
        }
        if (billing.getAmountPaid() == null) {
            billing.setAmountPaid(0.0);
        }
        return repo.save(billing);
    }

    public Billing update(Long id, Billing updated) {
        Billing existing = findById(id);
        if (updated.getPaymentStatus() != null) existing.setPaymentStatus(updated.getPaymentStatus());
        if (updated.getAmountPaid() != null) existing.setAmountPaid(updated.getAmountPaid());
        if (updated.getPaymentMethod() != null) existing.setPaymentMethod(updated.getPaymentMethod());
        if (updated.getTotalAmount() != null) existing.setTotalAmount(updated.getTotalAmount());
        return repo.save(existing);
    }

    public long countPending() {
        return repo.countByPaymentStatus("Pending") + repo.countByPaymentStatus("Overdue");
    }

    public Double getMonthlyRevenue(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return repo.sumRevenueByDateRange(start, end);
    }
}
