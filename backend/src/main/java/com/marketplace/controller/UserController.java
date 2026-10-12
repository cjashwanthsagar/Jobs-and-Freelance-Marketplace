package com.marketplace.controller;

import com.marketplace.dto.ApiResponse;
import com.marketplace.dto.ProfileUpdateRequest;
import com.marketplace.dto.UserDto;
import com.marketplace.security.UserPrincipal;
import com.marketplace.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto userDto = userService.getUserById(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved", userDto));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestBody ProfileUpdateRequest req) {
        UserDto updated = userService.updateProfile(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserProfile(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved", userDto));
    }
}
