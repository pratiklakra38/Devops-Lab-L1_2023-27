package com.portfolio.service;

import com.portfolio.dto.MessageDTO;
import java.util.List;

public interface MessageService {
    List<MessageDTO> getAllMessages();
    MessageDTO saveMessage(MessageDTO messageDTO);
    void deleteMessage(Long id);
}
