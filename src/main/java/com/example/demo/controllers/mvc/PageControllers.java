package com.example.demo.controllers.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageControllers {

    @RequestMapping("/chat")
    public String chat() {
        return "chat";
    }

    @RequestMapping("/")
    public String home() {
        return "landingpage";
    }

    @RequestMapping("/home")
    public String homepage() {
        return "landingpage";
    }

    @RequestMapping("/vision")
    public String getVision() {
        return "vision";
    }

}

