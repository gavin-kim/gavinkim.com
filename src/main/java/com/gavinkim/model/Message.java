package com.gavinkim.model;

/**
 * Stomp message builder
 */
public class Message {

    public enum Type {
        ACCEPT("ACCEPT"),
        ERROR("ERROR"),
        ROOM_INFO("ROOM_INFO"),
        USER_JOIN("USER_JOIN"),
        USER_LEAVE("USER_LEAVE"),
        MESSAGE("MESSAGE");

        private final String value;

        Type(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return value;
        }
    }

    final private String sender;
    final private String receiver;
    final private Type type;
    final private String destination;
    final private String roomId;
    final private Room room;
    final private User user;
    final private String body;

    private Message(Builder builder) {
        sender = builder.sender;
        receiver = builder.receiver;
        type = builder.type;
        destination = builder.destination;
        roomId = builder.roomId;
        room = builder.room;
        user = builder.user;
        body = builder.body;
    }

    public Type getType() {
        return type;
    }

    public String getSender() {
        return sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getDestination() {
        return destination;
    }

    public String getRoomId() {
        return roomId;
    }

    public Room getRoom() {
        return room;
    }

    public User getUser() {
        return user;
    }

    public String getBody() {
        return body;
    }


    public static class Builder {

        private String sender;
        private String receiver;
        private Type type;
        private String destination;
        private String roomId;
        private Room room;
        private User user;
        private String body;

        public Builder setSender(String sender) {
            this.sender = sender;
            return this;
        }

        public Builder setReceiver(String receiver) {
            this.receiver = receiver;
            return this;
        }

        public Builder setType(Type type) {
            this.type = type;
            return this;
        }

        public Builder setDestination(String destination) {
            this.destination = destination;
            return this;
        }

        public Builder setRoomId(String roomId) {
            this.roomId = roomId;
            return this;
        }

        public Builder setRoom(Room room) {
            this.room = room;
            return this;
        }

        public Builder setUser(User user) {
            this.user = user;
            return this;
        }

        public Builder setBody(String body) {
            this.body = body;
            return this;
        }

        public Message build() {

            return new Message(this);
        }

    }
}
