package com.kwanii.repository;


import com.kwanii.model.User;

public interface UserRepository {
    void put(User user);
    User get(String userId);
    void delete(String userId);
    boolean exists(String userId);
}
