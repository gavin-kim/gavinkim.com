package com.kwanii.controller;


import com.kwanii.model.Message;
import com.kwanii.model.Room;
import com.kwanii.model.User;
import com.kwanii.service.ChatService;
import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class StompController {

    /**
     * "/app/test"'s destination is this method
     *
     * registry.setApplicationDestinationPrefixes("/chat") in StompConfig
     *
     * Spring can convert message payloads to java types:
     *
     * -ByteArrayMessageConverter      : application/octet-stream <-> byte[]
     * -MappingJackson2MessageConverter: application/json <-> java object
     * -StringMessageConverter         : text/plain <-> String
     *
     * "/app/msg" -> @MessageMapping("/msg") -> @SendTo("/queue/msg") -> BrokerChannel("/queue/msg")
     *
     * @SendToUser: send to a unique user, UserDestinationMessageHandler will reroute the message
     *
     * Server side: @SendToUser("/queue/msg")          -> "/queue/msg-userabcd1234" in a message broker
     * Client side: stomp.subscribe("/user/queue/msg") -> "/queue/msg-userabcd1234" in a message broker
     *
     * The return value also follows the same rules as for @MessageMapping,
     * except if the method is not annotated with @SendTo or @SendToUser,
     * the message is sent directly back to the connected user and does not pass through the message broker.
     *
     * This is useful for implementing a request-reply pattern
     *
     */
    private static final String QUEUE_DST = "/queue/server";
    private static final String TOPIC_GLOBAL_DST = "/topic/global";
    private static final String TOPIC_ROOM_DST = "/topic/room/";
    private static final String MESSAGE_COLOR = "#000000";

    private Logger logger = Logger.getLogger(this.getClass());
    private SimpMessagingTemplate messaging;
    private ChatService chatService;

    // inject messaging template from StompConfig(AbstractWebSocketMessageBrokerConfigurer)
    @Autowired
    public void setSimpMessaging(SimpMessagingTemplate messagingTemplate) {
        this.messaging = messagingTemplate;
    }

    @Autowired
    public void setChatService(ChatService chatService) {
        this.chatService = chatService;
    }

    // create a new room, broadcast(false): only one session
    @MessageMapping("/create")
    public void create(StompHeaderAccessor accessor) {

        String roomId = accessor.getFirstNativeHeader("roomId");
        String password = accessor.getFirstNativeHeader("password");
        String userId = accessor.getSessionId();
        String userName = accessor.getFirstNativeHeader("userName");
        String dst = accessor.getDestination();

        Message.Builder builder = new Message.Builder()
            .setSender("server").setReceiver(userId)
            .setRoomId(roomId).setDestination(dst);

        if (chatService.roomExists(roomId)) {
            String message = "'" + roomId + "' already exists.";
            System.out.println(message);

            builder.setBody(message).setType(Message.Type.ERROR).setDestination(dst);
            messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());
            return;
        }

        chatService.createRoom(new Room(roomId, userId, password));
        chatService.join(userId, roomId, userName);
        System.out.println("Created: " + roomId + password + userName);

        // subscribeEventListener will broadcast the room info
        builder.setType(Message.Type.ACCEPT)
            .setRoomId(roomId).setRoom(chatService.getRoom(roomId));
        messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());
    }

    // join a room
    @MessageMapping("/join")
    public void join(StompHeaderAccessor accessor) {

        String roomId = accessor.getFirstNativeHeader("roomId");
        String password = accessor.getFirstNativeHeader("password");
        String userName = accessor.getFirstNativeHeader("userName");
        String userId = accessor.getSessionId();
        String dst = accessor.getDestination();

        Message.Builder builder = new Message.Builder()
            .setSender("server").setReceiver(userId)
            .setDestination(dst).setRoomId(roomId);

        // A room doesn't exist
        if (!chatService.roomExists(roomId)) {
            String message = "'" + roomId + "' doesn't exist.";
            System.out.println(message);

            // queue message
            builder.setType(Message.Type.ERROR).setBody(message);
            messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());
            return;

        // A user is already a member of the room
        } else if (chatService.hasUser(roomId, userId)) {
            String message =
                "'" + userId + "' already joined the room: " + roomId + "'";
            System.out.println(message);

            builder.setType(Message.Type.ERROR).setBody(message);
            messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());
            return;
        }

        // authenticate the password
        if (chatService.authenticate(roomId, password)) {

            chatService.join(userId, roomId, userName);
            System.out.println(userId + " joined roomId: " + roomId);

            builder.setType(Message.Type.ACCEPT)
                .setRoom(chatService.getRoom(roomId));

            // queue message
            messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());

            // topic message
            User user = chatService.getRoom(roomId).getUser(userId);
            topicRoomInfo(roomId, user, Message.Type.USER_JOIN);

        // the password is wrong
        } else {
            String message = "Password is wrong.";
            System.out.println(message);

            // queue message
            builder.setType(Message.Type.ERROR).setBody(message);
            messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());
        }
    }

    // leave a room
    @MessageMapping("/leave")
    public void leave(StompHeaderAccessor accessor) {
        String roomId = accessor.getFirstNativeHeader("roomId");
        String userId = accessor.getSessionId();
        String dst = accessor.getDestination();

        Message.Builder builder = new Message.Builder()
            .setSender("server").setReceiver(userId)
            .setDestination(dst).setRoomId(roomId);

        // A room doesn't exist
        if (!chatService.roomExists(roomId)) {
            String message = "Leave Error: " + roomId + " doesn't exist.";
            System.out.println(message);

            // queue message
            builder.setType(Message.Type.ERROR).setBody(message);
            messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());
            return;
        }

        // remove a user in the room
        User user = chatService.getRoom(roomId).getUser(userId);
        chatService.exit(userId, roomId);
        System.out.println(userId + " exited roomId: " + roomId);

        // queue message
        builder.setType(Message.Type.ACCEPT);
        messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());

        // topic message
        if (chatService.roomExists(roomId)) {
            topicRoomInfo(roomId, user, Message.Type.USER_LEAVE);
        }
    }

    // topic message for other members of the room
    private void topicRoomInfo(String roomId, User user, Message.Type type) {

        Message.Builder builder = new Message.Builder()
            .setSender("server").setReceiver(roomId).setRoomId(roomId)
            .setRoom(chatService.getRoom(roomId)).setUser(user);

        switch (type) {
            case ROOM_INFO:
                builder.setType(Message.Type.ROOM_INFO);
                break;
            case USER_JOIN:
                builder.setType(Message.Type.USER_JOIN)
                    .setBody(" joined the room.");
                break;
            case USER_LEAVE:
                builder.setType(Message.Type.USER_LEAVE)
                    .setBody(" left the room.");
                break;
        }

        messaging.convertAndSend(TOPIC_ROOM_DST + roomId, builder.build());
    }

    // request to set a user name for a specific room
    @MessageMapping("/setUserName")
    public void setUserName(StompHeaderAccessor accessor) {

        String userId = accessor.getSessionId();
        String userName = accessor.getFirstNativeHeader("userName");
        String roomId = accessor.getFirstNativeHeader("roomId");
        String dst = accessor.getDestination();

        // set user name
        chatService.setUserName(roomId, userId, userName);

        // queue message
        Message.Builder builder = new Message.Builder()
            .setSender("server").setReceiver(userId)
            .setType(Message.Type.ACCEPT).setDestination(dst).setRoomId(roomId);

        messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());

        // topic message
        User user = chatService.getRoom(roomId).getUser(userId);
        topicRoomInfo(roomId, user, Message.Type.ROOM_INFO);
    }

    // request to set an icon
    @MessageMapping("/setIcon")
    public void setIconIndex(StompHeaderAccessor accessor) {

        String userId = accessor.getSessionId();
        String iconIndex = accessor.getFirstNativeHeader("iconIndex");
        String roomId = accessor.getFirstNativeHeader("roomId");
        String dst = accessor.getDestination();

        // set icon path
        chatService.setIconIndex(roomId, userId, Integer.parseInt(iconIndex));

        // queue message
        Message.Builder builder = new Message.Builder()
            .setSender("server").setReceiver(userId)
            .setType(Message.Type.ACCEPT).setDestination(dst).setRoomId(roomId);

        messaging.convertAndSendToUser(userId, QUEUE_DST, builder.build());

        // topic message
        User user = chatService.getRoom(roomId).getUser(userId);
        topicRoomInfo(roomId, user, Message.Type.ROOM_INFO);
    }

    /**
     * If the user more than one session, by default all of the session
     * subscribed to given destination are targeted. It's necessary
     * to target only the session that sent the message setting broadcast=false
     */
    @MessageExceptionHandler(Exception.class)
    public void handleMessageException(StompHeaderAccessor accessor,
                                       MessagingException ex) {

        String userId = accessor.getSessionId();
        String dst = accessor.getDestination();
        ex.printStackTrace();

        Message message = new Message.Builder()
            .setSender("server").setReceiver(userId)
            .setDestination(dst).setType(Message.Type.ERROR)
            .setBody(ex.toString()).build();

        messaging.convertAndSendToUser(userId, QUEUE_DST, message);
    }
}
