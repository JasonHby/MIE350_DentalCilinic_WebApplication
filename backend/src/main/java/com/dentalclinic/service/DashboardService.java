package com.dentalclinic.service;

import com.dentalclinic.repository.AppointmentRepository;
import com.dentalclinic.repository.BillingRepository;
import com.dentalclinic.repository.InventoryRepository;
import com.dentalclinic.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final PatientRepository patientRepo;
    private final AppointmentRepository appointmentRepo;
    private final InventoryRepository inventoryRepo;
    private final BillingRepository billingRepo;

    public DashboardService(PatientRepository patientRepo, AppointmentRepository appointmentRepo,
                            InventoryRepository inventoryRepo, BillingRepository billingRepo) {
        this.patientRepo = patientRepo;
        this.appointmentRepo = appointmentRepo;
        this.inventoryRepo = inventoryRepo;
        this.billingRepo = billingRepo;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepo.count());
        stats.put("todayAppointments", appointmentRepo.countByAppointmentDate(LocalDate.now()));
        stats.put("lowStockCount", inventoryRepo.countLowStock());
        stats.put("pendingBills", billingRepo.countByPaymentStatus("Pending") +
                                  billingRepo.countByPaymentStatus("Overdue"));

        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());
        Double revenue = billingRepo.sumRevenueByDateRange(monthStart, monthEnd);
        stats.put("monthlyRevenue", revenue != null ? revenue : 0.0);

        // Monthly trend data (last 6 months)
        java.util.List<Map<String, Object>> monthlyTrend = new java.util.ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate m = now.minusMonths(i);
            LocalDate mStart = m.withDayOfMonth(1);
            LocalDate mEnd = m.withDayOfMonth(m.lengthOfMonth());
            Map<String, Object> point = new HashMap<>();
            point.put("month", m.getMonth().toString().substring(0, 3) + " " + m.getYear());
            Double rev = billingRepo.sumRevenueByDateRange(mStart, mEnd);
            point.put("revenue", rev != null ? rev : 0.0);
            long apptCount = appointmentRepo.findByAppointmentDate(mStart).size();
            // approximate monthly count
            point.put("appointments", appointmentRepo.findAll().stream()
                    .filter(a -> !a.getAppointmentDate().isBefore(mStart) && !a.getAppointmentDate().isAfter(mEnd))
                    .count());
            monthlyTrend.add(point);
        }
        stats.put("monthlyTrend", monthlyTrend);

        return stats;
    }
}
