package com.dentalclinic;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PatientControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void patientCrudRoundTripWorksThroughApi() throws Exception {
        String createResponse = mockMvc.perform(post("/api/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "firstName", "Test",
                                "lastName", "Patient",
                                "dateOfBirth", "1999-04-12",
                                "gender", "Female",
                                "phone", "555-999-0000",
                                "email", "test.patient@example.com",
                                "address", "100 Integration Ave",
                                "medicalHistory", "Seasonal allergies"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.patientId").isNumber())
                .andExpect(jsonPath("$.registrationDate").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        long patientId = readJson(createResponse).get("patientId").asLong();

        mockMvc.perform(get("/api/patients/{id}", patientId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Test")))
                .andExpect(jsonPath("$.lastName", is("Patient")));

        mockMvc.perform(put("/api/patients/{id}", patientId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "phone", "555-111-2222",
                                "address", "200 Updated Road"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone", is("555-111-2222")))
                .andExpect(jsonPath("$.address", is("200 Updated Road")))
                .andExpect(jsonPath("$.firstName", is("Test")))
                .andExpect(jsonPath("$.lastName", is("Patient")));

        mockMvc.perform(get("/api/patients/search").param("name", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patientId", is((int) patientId)));

        mockMvc.perform(delete("/api/patients/{id}", patientId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/patients/{id}", patientId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", containsString("Patient not found")));
    }
}
