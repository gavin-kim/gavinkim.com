package com.kwanii.controller;


import com.kwanii.model.User;
import com.kwanii.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Controller
@RequestMapping("/chat")
public class ChatController {

    private ChatService chatService;

    @Autowired
    public void setChatService(ChatService chatService) {
        this.chatService = chatService;
    }
    @RequestMapping
    public String c(HttpServletRequest request) {
        return "chat/chat.html";
    }

    @RequestMapping("/room")
    public String room(HttpServletRequest request) {
        return "forward:/chat";
    }

    @RequestMapping("/error")
    public String error(HttpServletRequest request) {
        return "forward:/chat";
    }

    @RequestMapping("/form")
    public String form(HttpServletRequest request) {
        return "forward:/chat";
    }

    /**
     * Check a session exists and return the session's id
     * HTTP session exists : a user exists.
     * Stomp session exists: a user already connected the server.
     *
     * Client side needs to check duplicated stomp connection
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public Object chat(HttpServletRequest request) {

        System.out.println("/chat");

        HttpSession session = request.getSession(false);

        // for JSON
        Map<String, Object> response = new HashMap<>();

        // a new user
        if (session == null) {
            response.put("sessionId", request.getSession().getId());

        } else {
            response.put("sessionId", session.getId());

            User user = chatService.getUser(session.getId());
            response.put("user", user);

            Set<String> roomIds = user.getRoomIds();

            response.put("rooms",
                roomIds.size() > 0 ? chatService.getRooms(roomIds) : null);
        }

        return response;
    }
}
