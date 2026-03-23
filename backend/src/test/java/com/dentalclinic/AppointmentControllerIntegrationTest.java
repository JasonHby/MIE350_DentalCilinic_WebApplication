package com.dentalclinic;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AppointmentControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void appointmentConflictReturnsHttp409() throws Exception {
        mockMvc.perform(post("/api/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "patientId", 10,
                                "dentistId", 1,
                                "appointmentDate", "2026-03-06",
                                "appointmentTime", "09:15:00",
                                "duration", 30,
                                "notes", "Conflict test"
                        ))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", containsString("conflict")));
    }
}
