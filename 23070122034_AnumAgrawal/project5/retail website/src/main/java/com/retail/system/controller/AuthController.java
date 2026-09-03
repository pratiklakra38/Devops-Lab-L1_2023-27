package com.retail.system.controller;

import com.retail.system.dto.JwtAuthResponse;
import com.retail.system.dto.LoginDto;
import com.retail.system.dto.RegisterDto;
import com.retail.system.entity.Role;
import com.retail.system.entity.User;
import com.retail.system.repository.UserRepository;
import com.retail.system.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // ----- MVC Endpoints -----

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("registerDto", new RegisterDto());
        return "register";
    }

    @PostMapping("/register")
    public String registerUserMvc(@ModelAttribute("registerDto") RegisterDto registerDto, Model model) {
        if(userRepository.existsByUsername(registerDto.getUsername())){
            model.addAttribute("error", "Username is already taken!");
            return "register";
        }
        if(userRepository.existsByEmail(registerDto.getEmail())){
            model.addAttribute("error", "Email is already taken!");
            return "register";
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(Role.ROLE_ADMIN); // Setting as admin for demo purposes

        userRepository.save(user);
        return "redirect:/login?success";
    }

    // ----- REST API Endpoints -----

    @ResponseBody
    @PostMapping("/api/auth/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(@RequestBody LoginDto loginDto){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(token);

        return ResponseEntity.ok(jwtAuthResponse);
    }

    @ResponseBody
    @PostMapping("/api/auth/register")
    public ResponseEntity<?> registerUserApi(@RequestBody RegisterDto registerDto){
        if(userRepository.existsByUsername(registerDto.getUsername())){
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }
        if(userRepository.existsByEmail(registerDto.getEmail())){
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(Role.ROLE_ADMIN); // Default to admin for the exercise

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }
}
