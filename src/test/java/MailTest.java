import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.*;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;

public class MailTest {

    public static Logger logger = LoggerFactory.getLogger(MailTest.class);

    public static void main(String[] args) {
        sendEmail("kim", "kim@hotmail.com", "hello");
    }

    public static void sendEmail(String name, String email, String text) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.sasl.enable", "true");
        props.put("mail.smtp.host", "smtp.gavinkim.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.debug", "true");
        Session session = Session.getInstance(props, null);

        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setRecipients(Message.RecipientType.TO, "gavin.yk.kim@gmail.com");
            msg.setSentDate(new Date());
            msg.setFrom(email);
            msg.setSubject("java mail test");
            msg.setText(text);
            Transport.send(msg, "hello@gavinkim.com", "RLAdbsrhks74*$");

        } catch (MessagingException mex) {
            logger.error("Exception", mex);
        }
    }
}
