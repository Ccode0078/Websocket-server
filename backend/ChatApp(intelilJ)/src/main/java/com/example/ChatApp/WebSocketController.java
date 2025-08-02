package com.example.ChatApp;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
// Send messages to connected clients from any part of the application //
@Controller
public class WebSocketController {
    private final WebSocketSessionManager sessionManager;

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, WebSocketSessionManager sessionManager) {
        this.messagingTemplate = messagingTemplate;
        this.sessionManager = sessionManager;
    }

    @MessageMapping("/message")
    public void handleMessage(Message message) {
        System.out.println("Received message from user " + message.getUser() + ": " + message.getMessage());
        // Broadcast a users message to all the connected users //
        messagingTemplate.convertAndSend("/topic/messages", message);
        System.out.println("Sent message to /topic/messages: " + message.getUser() + ": " + message.getMessage());
    }
    @MessageMapping("/connect")
    public void connectUser(@Payload String username) {
        System.out.println("Received connect request with: " + username);
        sessionManager.addUsername(username);
        sessionManager.broadcastActiveUsername();
        System.out.println(username + "connected");
    }
    @MessageMapping("/disconnect")
    public void disconnectUser( String username) {
        sessionManager.removeUsername(username);
        sessionManager.broadcastActiveUsername();
        System.out.println(username + " Disconnected");

    }
}
