package com.gavinkim.controller;

import com.gavinkim.service.MailService;
import com.gavinkim.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping
public class HomeController {

    private Logger logger = LoggerFactory.getLogger(HomeController.class);

    private MailService mailService;

    @Autowired
    public HomeController(MailService mailService) {
        this.mailService = mailService;
    }

    @RequestMapping(value = {"/about", "/portfolio/*", "/portfolio", "/contact"})
    public String about() {
        return "forward:/";
    }

    @RequestMapping(value = "/contact", method = RequestMethod.POST)
    public String sendMessage(@RequestParam("name") String name,
                              @RequestParam("email") String email,
                              @RequestParam("message") String message) {

        mailService.send(name, email, message);
        return "redirect:/contact";
    }
}
