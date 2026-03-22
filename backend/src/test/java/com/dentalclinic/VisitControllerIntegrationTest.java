package com.dentalclinic;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class VisitControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void completingVisitGeneratesBillAndUpdatesAppointment() throws Exception {
        String visitResponse = mockMvc.perform(post("/api/visits")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "appointmentId", 1,
                                "chiefComplaint", "Tooth sensitivity",
                                "findings", "Minor enamel wear",
                                "diagnosis", "Sensitivity",
                                "treatmentPlan", "Fluoride treatment"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.visitId").isNumber())
                .andReturn()
                .getResponse()
                .getContentAsString();

        long visitId = readJson(visitResponse).get("visitId").asLong();

        mockMvc.perform(post("/api/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "visitId", visitId,
                                "serviceName", "Fluoride Treatment",
                                "description", "Topical fluoride application",
                                "unitCost", 85.0,
                                "quantity", 1,
                                "linkedInventoryItemId", 1
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.visitId", is((int) visitId)));

        String completeResponse = mockMvc.perform(post("/api/visits/{appointmentId}/complete", 1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.billId").isNumber())
                .andExpect(jsonPath("$.message", containsString("generated")))
                .andReturn()
                .getResponse()
                .getContentAsString();

        long billId = readJson(completeResponse).get("billId").asLong();

        mockMvc.perform(get("/api/appointments/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("Completed")));

        mockMvc.perform(get("/api/billing/{id}", billId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appointmentId", is(1)))
                .andExpect(jsonPath("$.patientId", is(1)))
                .andExpect(jsonPath("$.totalAmount", is(85.0)))
                .andExpect(jsonPath("$.paymentStatus", is("Pending")))
                .andExpect(jsonPath("$.amountPaid", is(0.0)));

        mockMvc.perform(get("/api/inventory/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(44)));

        mockMvc.perform(get("/api/services/visit/{visitId}", visitId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
}
