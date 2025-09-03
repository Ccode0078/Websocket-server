package com.example.ChatApp.client;

import com.example.ChatApp.Message;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

public class MyStompClient {
    private StompSession session;
    private String username;

    public MyStompClient(String username) throws InterruptedException, ExecutionException {
        this.username = username;

        // Create transport (SockJS with WebSocket fallback)
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));

        // Set up SockJS client
        SockJsClient sockJsClient = new SockJsClient(transports);

        // Set up STOMP client
        WebSocketStompClient stompClient = new WebSocketStompClient(sockJsClient);
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompSessionHandler sessionHandler = new MyStompSessionHandler(username);
        String url = "ws://localhost:8082/ws";

        session = stompClient.connectAsync(url, sessionHandler).get();
    }
           // Client Message from the Message class
    public void sendMessage(Message message) {
        try {
            session.send("/app/message", message);
            System.out.println("Message Sent: " + message.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void disconnectUser(String username) {
        session.send("/app/disconnect", username);
        System.out.println("Disconnect User: " + username);

    }


    public StompSession getSession() {
        return session;
    }
}
