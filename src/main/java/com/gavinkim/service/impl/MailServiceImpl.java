package com.gavinkim.service.impl;

import com.gavinkim.service.MailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;


import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;

@Service
@PropertySource("classpath:/property/config.properties")
public class MailServiceImpl implements MailService, EnvironmentAware {
    private Logger logger = LoggerFactory.getLogger(MailServiceImpl.class);
    private Environment env;
    private Properties props;
    private String smtpUsername;
    private String smtpPassword;
    private String recipient;

    @Override
    public void setEnvironment(Environment environment) {
        env = environment;
        initProperty();
    }

    private void initProperty() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", env.getProperty("mail.smtp.auth"));
        props.put("mail.smtp.starttls.enable", env.getProperty("mail.smtp.starttls.enable"));
        props.put("mail.smtp.sasl.enable", env.getProperty("mail.smtp.sasl.enable"));
        props.put("mail.smtp.host", env.getProperty("mail.smtp.host"));
        props.put("mail.smtp.port", env.getProperty("mail.smtp.port"));
        props.put("mail.debug", env.getProperty("mail.debug"));
        smtpUsername = env.getProperty("mail.smtp.username");
        smtpPassword = env.getProperty("mail.smtp.password");
        recipient = env.getProperty("mail.recipient");
        this.props = props;
    }

    @Override
    public void send(String name, String email, String message) {

        Session session = Session.getInstance(props, null);

        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setRecipients(Message.RecipientType.TO, recipient);
            msg.setSentDate(new Date());
            msg.setFrom(email);
            msg.setSubject("Received a message from gavinkim.com");
            msg.setText(message);
            Transport.send(msg, smtpUsername, smtpPassword);

        } catch (MessagingException mex) {
            logger.error("Exception", mex);
        }
    }
}
