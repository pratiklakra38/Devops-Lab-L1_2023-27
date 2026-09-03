package com.example.userservice.repository;
import com.example.userservice.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface UserRepository extends MongoRepository<User, String> {
}
