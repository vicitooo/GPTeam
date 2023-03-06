package com.example.demo.controllers.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/Agents/")
public class AgentsController {

    @RequestMapping("/MarketingSpecialist.html")
    public String marketing() {
        return "agents/MarketingSpecialist";
    }

    @RequestMapping("/Programmer.html")
    public String programmer() {
        return "agents/Programmer";
    }

    @RequestMapping("/ProductDesigner.html")
    public String designer() {
        return "agents/ProductDesigner";
    }

    @RequestMapping("/Socrates.html")
    public String socrates() {
        return "agents/Socrates";
    }

    @RequestMapping("/Jailbreak.html")
    public String jailbreak() {
        return "agents/Jailbreak";
    }
}
