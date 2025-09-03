package com.example.ChatApp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

// Manage connected users //
@Service
public class WebSocketSessionManager {
    private final ArrayList<String> activeUsernames = new ArrayList<>();
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public  WebSocketSessionManager(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;

    }
    public void addUsername(String username) {
        activeUsernames.add(username);
    }
    public void removeUsername(String username) {
        activeUsernames.remove(username);
    }
    public void broadcastActiveUsername() {
        messagingTemplate.convertAndSend("/topic/users", activeUsernames);
        System.out.println("Broadcasting active users to /topic/users" + activeUsernames);
    }
}
