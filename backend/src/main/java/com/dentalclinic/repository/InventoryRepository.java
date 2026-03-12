package com.dentalclinic.repository;

import com.dentalclinic.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderLevel")
    List<Inventory> findLowStock();

    long countByQuantityLessThanEqual(int threshold);

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity <= i.reorderLevel")
    long countLowStock();
}
