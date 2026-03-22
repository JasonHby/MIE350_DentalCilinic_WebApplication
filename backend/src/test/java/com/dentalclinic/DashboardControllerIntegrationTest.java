package com.dentalclinic;

import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DashboardControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void dashboardStatsExposeSeededSummary() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPatients", is(10)))
                .andExpect(jsonPath("$.todayAppointments", is(0)))
                .andExpect(jsonPath("$.lowStockCount", is(4)))
                .andExpect(jsonPath("$.pendingBills", is(5)))
                .andExpect(jsonPath("$.monthlyRevenue", is(0.0)))
                .andExpect(jsonPath("$.monthlyTrend", hasSize(6)));
    }
}
