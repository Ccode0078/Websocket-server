package com.example.ChatApp.client;

import com.example.ChatApp.Message;

import java.util.concurrent.ExecutionException;

public class ClientGui {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        MyStompClient myStompClient = new MyStompClient("TapTap");


        Thread.sleep(1000);  // Wait for STOMP connection and subscription

        //  Send a message
        myStompClient.sendMessage(new Message("TapTap", "Hello World"));

        //  Wait to ensure message is delivered
        Thread.sleep(500);

        //  Disconnect
        myStompClient.disconnectUser("TapTap");
    }
}
