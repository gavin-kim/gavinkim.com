package com.kwanii.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

@Configuration
@Cacheable // enable caching
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        JedisConnectionFactory jcf = new JedisConnectionFactory();
        jcf.setHostName("localhost");
        jcf.setPort(6379);
        jcf.setUsePool(true);
        return jcf;
    }

    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory rcf) {
        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(rcf);
        return redisTemplate;
    }

    // cache manager bean
    @Bean
    public CacheManager cacheManager(RedisTemplate redisTemplate) {
        return new RedisCacheManager(redisTemplate);
    }
}
