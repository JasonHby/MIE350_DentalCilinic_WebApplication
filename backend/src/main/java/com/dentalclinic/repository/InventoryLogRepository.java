package com.dentalclinic.repository;

import com.dentalclinic.model.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {

    List<InventoryLog> findByItemIdOrderByChangedAtDesc(Long itemId);

    List<InventoryLog> findByChangedAtBetweenOrderByChangedAtDesc(LocalDateTime start, LocalDateTime end);

    List<InventoryLog> findAllByOrderByChangedAtDesc();
}
