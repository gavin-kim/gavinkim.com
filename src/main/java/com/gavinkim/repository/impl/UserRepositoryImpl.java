package com.gavinkim.repository.impl;

import com.gavinkim.model.User;
import com.gavinkim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private static final Class<?> KEY = User.class;
    private HashOperations<Class<?>, String, User> hashOperations;

    @Autowired
    @SuppressWarnings("unchecked")
    public UserRepositoryImpl(RedisOperations<?, ?> redisOperations) {
        hashOperations =
            ((RedisOperations<Class<?>, User>) redisOperations).opsForHash();
    }

    @Override
    public void put(User user) {
        hashOperations.put(KEY, user.getUserId(), user);
    }

    @Override
    public User get(String userId) {
        return hashOperations.get(KEY, userId);
    }

    @Override
    public void delete(String userId) {
        hashOperations.delete(KEY, userId);
    }

    @Override
    public boolean exists(String userId) {
        return hashOperations.hasKey(KEY, userId);
    }
}
