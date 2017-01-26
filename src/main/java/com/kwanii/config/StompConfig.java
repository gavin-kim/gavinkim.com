package com.kwanii.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.web.socket.config.WebSocketMessageBrokerStats;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker // Enable STOMP messaging
public class StompConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/stomp").withSockJS(); // WebSocket clients connect to the endpoint "/stomp"
    }

    /**
     * SimpleBroker: an in-memory broker, only supports a subset of STOMP
     * StompBrokerRelay: Such as RabbitMQ or ActiveMQ
     *                   By default, port: 61613, (id, pass): guest
     *
     * RabbitMQ: only allows /queue, /temp-queue, /reply-queue, /amq/queue
     *           , /topic, /exchange
     *
     * request("/queue/dst")-> Message Broker          -> broker channel("/queue/dst")
     * request("/app/dst")  -> @MessageMapping("/dst") -> Message Broker -> broker channel("/queue/dst")
     * request("/app/sm")   -> @SubscribeMapping("/sm")-> client
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        //registry.enableSimpleBroker("/queue", "/topic");
        registry.enableStompBrokerRelay("/queue/", "/topic/", "/user/");
        registry.setApplicationDestinationPrefixes("/chat");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.taskExecutor().corePoolSize(10).maxPoolSize(20);

    }

    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        registration.taskExecutor().corePoolSize(10).maxPoolSize(20);
        registration.setInterceptors(outboundInterceptorAdapter());
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration
            // how long a send is allowed to take (10 secs)
            .setSendTimeLimit(10 * 1000)
            // how much data can be buffered when sending messages to a client (512K)
            // WebSocket servers limits, 8K on Tomcat, 64K on Jetty
            // STOMP client split larger messages at 16K boundaries and requires the server to buffer and re-assemble.
            // WebSocket message size will be automatically adjusted if necessary
            .setSendBufferSizeLimit(512 * 1024);
    }

    // For Runtime monitoring, WebSocketMessageBrokerStats gathers all available information.
    @Bean
    public WebSocketMessageBrokerStats webSocketMessageBrokerStats() {
        return new WebSocketMessageBrokerStats();

    }

    @Bean
    public ChannelInterceptorAdapter outboundInterceptorAdapter() {


        return new ChannelInterceptorAdapter() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                if (!accessor.isHeartbeat())
                    System.out.println(accessor);
                return message;
            }
        };
    }
}
