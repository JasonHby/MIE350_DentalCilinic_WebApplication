package com.dentalclinic.dto;

public class LoginResponseDTO {
    private Long userId;
    private String username;
    private String role;

    // Getters
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getRole() { return role; }

    // Setters
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUsername(String username) { this.username = username; }
    public void setRole(String role) { this.role = role; }
}