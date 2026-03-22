package com.dentalclinic;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class InventoryControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void inventoryRestockUpdatesQuantityAndWritesHistory() throws Exception {
        mockMvc.perform(put("/api/inventory/{id}/restock", 4)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "quantity", 3,
                                "supplier", "Integration Test Supplier"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemId", is(4)))
                .andExpect(jsonPath("$.quantity", is(8)))
                .andExpect(jsonPath("$.supplier", is("Integration Test Supplier")));

        mockMvc.perform(get("/api/inventory/history").param("itemId", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].changeType", is("Restock")))
                .andExpect(jsonPath("$[0].newQty", is(8)))
                .andExpect(jsonPath("$[0].reason", is("Restocked from Integration Test Supplier")));
    }
}
