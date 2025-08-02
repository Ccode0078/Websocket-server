package com.example.ChatApp.client;

import org.springframework.messaging.simp.stomp.*;
import java.lang.reflect.Type;

// Import your custom Message class
import com.example.ChatApp.Message;


public class MyStompSessionHandler extends StompSessionHandlerAdapter {

    private String username;

    public MyStompSessionHandler(String username) {
        this.username = username;
    }

    @Override
    public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
        System.out.println("Client Connected");
        session.send("/app/connect", username);
        session.subscribe("/topic/messages", new StompFrameHandler() {

            @Override
            public Type getPayloadType(StompHeaders headers) {
                return Message.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                try {
                    if (payload instanceof Message) {
                        Message message = (Message) payload;
                        System.out.println("Received message: " + message.getUser() + ": " + message.getMessage());
                    } else {
                        System.out.println("Unexpected payload type: " + payload.getClass());
                    }
                } catch (Exception e) {
                    System.out.println("Error handling frame: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        });
        System.out.println("Client subscribe to /topic/messages");
    }
}


