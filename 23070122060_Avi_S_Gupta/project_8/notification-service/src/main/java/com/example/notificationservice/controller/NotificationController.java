package com.example.notificationservice.controller;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/notify")
    public Notification notify(@RequestBody String message) {
        return notificationService.sendNotification(message);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
}
