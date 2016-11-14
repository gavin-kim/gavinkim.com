package com.kwanii.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class Room implements Serializable {

    @JsonIgnore
    private static final long serialVersionUID = -5489576101754753283L;

    private String roomId;
    private String ownerId;
    private String password;

    private Map<String, User> users = new HashMap<>();

    public Room() {}

    public Room(String roomId, String ownerId, String password) {
        this.roomId = roomId;
        this.ownerId = ownerId;
        this.password = password;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public boolean setOwnerId(String ownerId) {
        if (users.containsKey(ownerId)) {
            this.ownerId = ownerId;
            return true;
        }
        else
            return false;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isSecure() {
        return password != null;
    }

    public Map<String, User> getUsers() {
        return users;
    }

    public void setUsers(Map<String, User> users) {
        this.users = users;
    }

    public void putUser(User user) {
        users.put(user.getUserId(), user);
    }

    public boolean hasUser(String userId) {
        return users.containsKey(userId);
    }

    public User getUser(String userId) {
        return users.get(userId);
    }

    public User removeUser(String userId) {
        return users.remove(userId);
    }

    public int size() {
        return users.size();
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return obj == this ||
            obj instanceof Room && ((Room) obj).getRoomId().equals(roomId);
    }

    @Override
    public String toString() {
        return "Room{" +
            "roomId='" + roomId + '\'' +
            ", users=" + users.keySet() +
            '}';
    }
}
