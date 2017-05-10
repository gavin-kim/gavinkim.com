package com.gavinkim.repository;


import com.gavinkim.model.User;

public interface UserRepository {
    void put(User user);

    User get(String userId);

    void delete(String userId);

    boolean exists(String userId);
}
