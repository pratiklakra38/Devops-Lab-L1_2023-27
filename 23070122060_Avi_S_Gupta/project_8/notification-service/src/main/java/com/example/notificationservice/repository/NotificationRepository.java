package com.example.notificationservice.repository;
import com.example.notificationservice.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface NotificationRepository extends MongoRepository<Notification, String> {
}
