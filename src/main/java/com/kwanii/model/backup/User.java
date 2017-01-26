package com.kwanii.model.backup;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

public class User implements Serializable {

    private static final long serialVersionUID = 2637763454598467134L;

    private String userId;
    private String name;
    private int iconIndex;
    private boolean stompConnected;
    private Set<String> roomIds = new HashSet<>();

    public User() {}

    public User(String userId, String name) {
        this.userId = userId;
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setSessionId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addRoomId(String roomId) {
        roomIds.add(roomId);
    }

    public boolean removeRoomId(String roomId) {
        return roomIds.remove(roomId);
    }

    public Set<String> getRoomIds() {
        return new HashSet<>(roomIds);
    }


    public int getIconIndex() {
        return iconIndex;
    }

    public void setIconIndex(int iconIndex) {
        this.iconIndex = iconIndex;
    }

    public boolean isStompConnected() {
        return stompConnected;
    }

    public void setStompConnected(boolean stompConnected) {
        this.stompConnected = stompConnected;
    }

    @Override
    public boolean equals(Object obj) {
        return obj == this ||
            obj instanceof User && ((User)obj).getUserId().equals(userId);
    }

    @Override
    public int hashCode() {
        return 17 * 31 + userId.hashCode();
    }


    @Override
    public String toString() {
        return String.format("SessionId: %s, Name: %s", userId, name);
    }
}
