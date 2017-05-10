package com.gavinkim.service;

import com.gavinkim.model.Room;
import com.gavinkim.model.User;

import java.util.Collection;
import java.util.Map;

public interface ChatService {

    void createUser(User user);

    void removeUser(String userId);

    void createRoom(Room room);

    void removeRoom(String roomId);

    User getUser(String userId);

    Room getRoom(String roomId);

    Map<String, Room> getRooms(Collection<String> roomIds);

    void join(String userId, String roomId, String userName);

    void exit(String userId, String roomId);

    boolean hasUser(String roomId, String userId);

    boolean roomExists(String roomId);

    boolean setOwner(String roomId, String userId);

    boolean authenticate(String roomId, String password);

    void setUserName(String roomId, String userId, String userName);

    void setIconIndex(String roomId, String userId, int iconIndex);

    void setUserStompConnection(String userId, boolean isConnected);
}
