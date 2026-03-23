package com.dentalclinic;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void loginSucceedsForSeededReceptionist() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "username", "receptionist",
                                "password", "dental123"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("receptionist")))
                .andExpect(jsonPath("$.role", is("receptionist")))
                .andExpect(jsonPath("$.userId").isNumber());
    }
}
