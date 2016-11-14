package com.kwanii.service.impl;

import com.kwanii.model.Room;
import com.kwanii.model.User;
import com.kwanii.repository.RoomRepository;
import com.kwanii.repository.UserRepository;
import com.kwanii.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private static final int ICON_INDEX_MAX = 25;
    private RoomRepository roomRepository;
    private UserRepository userRepository;

    @Autowired
    public void init(RoomRepository roomRepository,
                     UserRepository userRepository) {

        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void createUser(User user) {
        userRepository.put(user);
    }

    @Override
    public void removeUser(String userId) {
        userRepository.delete(userId);
    }

    @Override
    public void createRoom(Room room) {
        roomRepository.put(room);
    }

    @Override
    public void removeRoom(String roomId) {
        roomRepository.delete(roomId);
    }

    @Override
    public User getUser(String userId) {
        return userRepository.get(userId);
    }

    @Override
    public Room getRoom(String roomId) {
        return roomRepository.get(roomId);
    }

    @Override
    public Map<String, Room> getRooms(Collection<String> roomIds) {

        return roomRepository.multiGet(roomIds).parallelStream()
            .collect(Collectors.toMap(Room::getRoomId, room -> room));
    }

    @Override
    public void join(String userId, String roomId, String userName) {
        User user = userRepository.get(userId);
        Room room = roomRepository.get(roomId);

        if (user == null || room == null || room.hasUser(userId))
            return;

        // set random icon index
        user.setIconIndex((int)(Math.random() * ICON_INDEX_MAX) + 1);
        user.setName(userName);
        user.addRoomId(roomId);
        room.putUser(user);

        roomRepository.put(room);
        userRepository.put(user);
    }

    @Override
    public void exit(String userId, String roomId) {
        User user = userRepository.get(userId);
        Room room = roomRepository.get(roomId);

        if (user == null || room == null || !room.hasUser(userId))
            return;

        room.removeUser(userId);
        user.removeRoomId(roomId);

        roomRepository.put(room);
        userRepository.put(user);

        System.out.println(room.size());

        if (room.size() <= 0)
            roomRepository.delete(roomId);
    }

    @Override
    public boolean setOwner(String roomId, String userId) {
        Room room  = roomRepository.get(roomId);
        return room == null || room.setOwnerId(userId);
    }

    @Override
    public boolean hasUser(String roomId, String userId) {
        return roomRepository.get(roomId).getUser(userId) != null;
    }

    @Override
    public boolean roomExists(String roomId) {
        return roomRepository.exists(roomId);
    }

    @Override
    public boolean authenticate(String roomId, String password) {
        Room room = getRoom(roomId);

        return !room.isSecure() || room.getPassword().equals(password);
    }

    // only change a user name in the specific room
    @Override
    public void setUserName(String roomId, String userId, String userName) {

        //TODO: check error
        Room room = roomRepository.get(roomId);
        room.getUser(userId).setName(userName);
        roomRepository.put(room);
    }

    @Override
    public void setIconIndex(String roomId, String userId, int iconIndex) {

        //TODO: check error
        Room room = roomRepository.get(roomId);
        room.getUser(userId).setIconIndex(iconIndex);
        roomRepository.put(room);
    }

    @Override
    public void setUserStompConnection(String userId, boolean isConnected) {

        User user = userRepository.get(userId);

        if (user == null)
            return;

        user.setStompConnected(isConnected);
        userRepository.put(user);

        roomRepository.multiGet(user.getRoomIds()).forEach(room -> {
            room.getUser(userId).setStompConnected(isConnected);
            roomRepository.put(room);
        });
    }
}
