package com.retail.system.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        // Here we can handle unauthorized requests by returning 401,
        // but for a web application we might want to redirect to the login page.
        // For REST APIs:
        // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
        response.sendRedirect("/login");
    }
}
