package com.portfolio.controller;

import com.portfolio.dto.MessageDTO;
import com.portfolio.service.MessageService;
import com.portfolio.service.ProjectService;
import com.portfolio.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class HomeController {

    private final ProjectService projectService;
    private final SkillService skillService;
    private final MessageService messageService;

    public HomeController(ProjectService projectService, SkillService skillService, MessageService messageService) {
        this.projectService = projectService;
        this.skillService = skillService;
        this.messageService = messageService;
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("projects", projectService.getAllProjects());
        model.addAttribute("skills", skillService.getAllSkills());
        if(!model.containsAttribute("messageDTO")) {
            model.addAttribute("messageDTO", new MessageDTO());
        }
        return "index";
    }

    @PostMapping("/contact")
    public String submitContact(@Valid @ModelAttribute("messageDTO") MessageDTO messageDTO,
                                BindingResult bindingResult,
                                RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.messageDTO", bindingResult);
            redirectAttributes.addFlashAttribute("messageDTO", messageDTO);
            redirectAttributes.addFlashAttribute("error", "Please fill all required fields correctly.");
            return "redirect:/#contact";
        }

        try {
            messageService.saveMessage(messageDTO);
            redirectAttributes.addFlashAttribute("success", "Your message has been sent successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "An error occurred while sending your message. Please try again later.");
        }

        return "redirect:/#contact";
    }
}
