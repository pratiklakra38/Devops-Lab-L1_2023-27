package com.portfolio.service;

import com.portfolio.dto.MessageDTO;
import com.portfolio.entity.Message;
import com.portfolio.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public List<MessageDTO> getAllMessages() {
        return messageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageDTO saveMessage(MessageDTO dto) {
        Message message = Message.builder()
                .id(dto.getId())
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .content(dto.getContent())
                .createdAt(dto.getCreatedAt())
                .build();
        Message saved = messageRepository.save(message);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }

    private MessageDTO convertToDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .name(message.getName())
                .email(message.getEmail())
                .phone(message.getPhone())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
