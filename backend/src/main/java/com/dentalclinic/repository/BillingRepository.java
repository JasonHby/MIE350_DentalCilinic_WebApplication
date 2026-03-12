package com.dentalclinic.repository;

import com.dentalclinic.model.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BillingRepository extends JpaRepository<Billing, Long> {

    List<Billing> findByPatientId(Long patientId);

    List<Billing> findByPaymentStatus(String paymentStatus);

    long countByPaymentStatus(String paymentStatus);

    @Query("SELECT COALESCE(SUM(b.amountPaid), 0) FROM Billing b WHERE b.billingDate BETWEEN :start AND :end")
    Double sumRevenueByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
