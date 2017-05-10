package com.gavinkim.listener;


import com.gavinkim.model.Message;
import com.gavinkim.model.User;
import com.gavinkim.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * When HTTP session is created, create a new user
 * When HTTP session is destroyed, remove a user and leave all room the user joined
 */
@Component
public class SessionListener implements HttpSessionListener, ApplicationContextAware {

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

    // Implementing ApplicationContextAware is to access a set of collaborating beans
    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
        throws BeansException {

        if (applicationContext instanceof WebApplicationContext) {
            ((WebApplicationContext) applicationContext).getServletContext()
                .addListener(this);
        } else {
            throw new RuntimeException("Must be inside a web application context");
        }

    }

    // create a chat user
    @Override
    public void sessionCreated(HttpSessionEvent se) {
        System.out.println("Session Created");
        chatService.createUser(new User(se.getSession().getId(), ""));
    }

    // remove the user and send leave message to other users
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        System.out.println("Session Destroyed");

        User user = chatService.getUser(se.getSession().getId());

        if (user == null)
            return;

        user.getRoomIds().forEach(roomId -> {
            chatService.exit(user.getUserId(), roomId);
            topicUserLeave(user, roomId);
        });

        chatService.removeUser(user.getUserId());
        System.out.println("[Disconnected]: deleted a user: " + user);
    }

    private void topicUserLeave(User user, String roomId) {
        if (chatService.roomExists(roomId)) {
            Message message = new Message.Builder()
                .setSender("server").setReceiver(roomId)
                .setType(Message.Type.USER_LEAVE).setRoomId(roomId)
                .setRoom(chatService.getRoom(roomId)).setUser(user)
                .setBody(" left the room.")
                .build();

            messaging.convertAndSend(TOPIC_ROOM_DST + roomId, message);
            System.out.printf("[Topic User Leave]: User: %s, RoomId: %s",
                user, roomId);
        }
    }
}
