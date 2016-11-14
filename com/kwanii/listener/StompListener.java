package com.kwanii.listener;

import com.kwanii.model.Message;
import com.kwanii.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

/**
 * Listeners for the stomp connection
 */
@Component
public class StompListener {

    private static final String QUEUE_DST = "/queue/server";
    private static final String TOPIC_GLOBAL_DST = "/topic/global";
    private static final String TOPIC_ROOM_DST = "/topic/room/";

    private Logger logger = LoggerFactory.getLogger(this.getClass());
    private SimpMessagingTemplate messaging;
    private ChatService chatService;

    @Autowired
    public void setSimpMessagingTemplate(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    @Autowired
    public void setChatService(ChatService chatService) {
        this.chatService = chatService;
    }

    @EventListener
    public void connected(SessionConnectedEvent event) {
        SimpMessageHeaderAccessor accessor =
            SimpMessageHeaderAccessor.wrap(event.getMessage());

        String userId = accessor.getSessionId();

        // connected the stomp
        chatService.setUserStompConnection(userId, true);

        chatService.getRooms(chatService.getUser(userId).getRoomIds())
            .forEach((roomId, room) -> {

                Message message = new Message.Builder()
                    .setSender("server").setReceiver(roomId)
                    .setType(Message.Type.ROOM_INFO)
                    .setRoomId(roomId).setRoom(room).build();

                messaging.convertAndSend(TOPIC_ROOM_DST + roomId, message);
            });

        System.out.println("[Stomp Connected]: " + userId);
    }

    @EventListener
    public void sessionDisconnected(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor accessor =
            SimpMessageHeaderAccessor.wrap(event.getMessage());

        String userId = accessor.getSessionId();

        // disconnected the stomp
        chatService.setUserStompConnection(userId, false);

        chatService.getRooms(chatService.getUser(userId).getRoomIds())
            .forEach((roomId, room) -> {

                Message message = new Message.Builder()
                    .setSender("server").setReceiver(roomId)
                    .setType(Message.Type.ROOM_INFO)
                    .setRoomId(roomId).setRoom(room).build();

                messaging.convertAndSend(TOPIC_ROOM_DST + roomId, message);
            });


        System.out.println("[Stomp Disconnected]: " + accessor.getSessionId());
    }

    /**
     * When a user subscribe room's topic, broadcast the room info in the room
     * NOTE: Only SubscribeEvent has destination
     */
    @EventListener
    public void sessionSubscribeEvent(SessionSubscribeEvent event) {

        SimpMessageHeaderAccessor accessor =
            SimpMessageHeaderAccessor.wrap(event.getMessage());

        // when a user subscribe a room topic, give a room info
        if (accessor.getDestination().startsWith("/topic/room/")) {

            String userId = accessor.getSessionId();
            String roomId = accessor.getDestination().substring(12);

            Message message = new Message.Builder()
                .setType(Message.Type.ROOM_INFO)
                .setSender("server").setReceiver(userId)
                .setRoomId(roomId).setRoom(chatService.getRoom(roomId))
                .build();

            messaging.convertAndSendToUser(userId, QUEUE_DST, message);
        }

        System.out.println("[Subscribe]: " + event);
    }
}
