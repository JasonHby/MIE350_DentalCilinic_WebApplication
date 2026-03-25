package com.dentalclinic.controller;

import com.dentalclinic.model.User;
import com.dentalclinic.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dentalclinic.dto.LoginRequestDTO;
import com.dentalclinic.dto.LoginResponseDTO;


import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }

        Optional<User> user = userRepository.findByUsernameAndPassword(username, password);

        if (user.isPresent()) {
            User u = user.get();

            LoginResponseDTO responseDTO = new LoginResponseDTO();
            responseDTO.setUserId(u.getUserId());
            responseDTO.setUsername(u.getUsername());
            responseDTO.setRole(u.getRole());

            return ResponseEntity.ok(responseDTO);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password"));
    }
}
