package com.kwanii.repository.impl;


import com.kwanii.model.Room;
import com.kwanii.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public class RoomRepositoryImpl implements RoomRepository {

    private static final Class<?> KEY = Room.class;
    private HashOperations<Class<?>, String , Room> hashOperations;

    @Autowired
    public RoomRepositoryImpl(RedisOperations<?, ?> redisOperations) {
        hashOperations =
            ((RedisOperations<Class<?>, Room>) redisOperations).opsForHash();
    }

    @Override
    public void put(Room room) {
        hashOperations.put(KEY, room.getRoomId(), room);
    }

    @Override
    public Room get(String roomId) {
        return hashOperations.get(KEY, roomId);
    }

    @Override
    public List<Room> multiGet(Collection<String> roomIds) {
        return hashOperations.multiGet(KEY, roomIds);
    }

    @Override
    public void delete(String roomId) {
        hashOperations.delete(KEY, roomId);
    }

    @Override
    public boolean exists(String roomId) {
        return hashOperations.hasKey(KEY, roomId);
    }
}
