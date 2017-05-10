package com.gavinkim.repository;

import com.gavinkim.model.Room;

import java.util.Collection;
import java.util.List;

public interface RoomRepository {
    void put(Room room);

    Room get(String roomId);

    List<Room> multiGet(Collection<String> roomIds);

    void delete(String roomId);

    boolean exists(String roomId);
}
