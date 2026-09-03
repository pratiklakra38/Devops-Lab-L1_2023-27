package com.portfolio.controller;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.dto.SkillDTO;
import com.portfolio.service.MessageService;
import com.portfolio.service.ProjectService;
import com.portfolio.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final ProjectService projectService;
    private final SkillService skillService;
    private final MessageService messageService;

    public AdminController(ProjectService projectService, SkillService skillService, MessageService messageService) {
        this.projectService = projectService;
        this.skillService = skillService;
        this.messageService = messageService;
    }

    @GetMapping({"", "/", "/dashboard"})
    public String dashboard(Model model) {
        model.addAttribute("projectCount", projectService.getAllProjects().size());
        model.addAttribute("skillCount", skillService.getAllSkills().size());
        model.addAttribute("messageCount", messageService.getAllMessages().size());
        return "admin/dashboard";
    }

    // Projects CRUD
    @GetMapping("/projects")
    public String listProjects(Model model) {
        model.addAttribute("projects", projectService.getAllProjects());
        return "admin/projects";
    }

    @GetMapping("/projects/add")
    public String showAddProjectForm(Model model) {
        model.addAttribute("project", new ProjectDTO());
        return "admin/project-form";
    }

    @GetMapping("/projects/edit/{id}")
    public String showEditProjectForm(@PathVariable Long id, Model model) {
        model.addAttribute("project", projectService.getProjectById(id));
        return "admin/project-form";
    }

    @PostMapping("/projects/save")
    public String saveProject(@Valid @ModelAttribute("project") ProjectDTO projectDTO,
                              BindingResult bindingResult, RedirectAttributes attributes) {
        if (bindingResult.hasErrors()) {
            return "admin/project-form";
        }
        projectService.saveProject(projectDTO);
        attributes.addFlashAttribute("success", "Project saved successfully.");
        return "redirect:/admin/projects";
    }

    @GetMapping("/projects/delete/{id}")
    public String deleteProject(@PathVariable Long id, RedirectAttributes attributes) {
        projectService.deleteProject(id);
        attributes.addFlashAttribute("success", "Project deleted successfully.");
        return "redirect:/admin/projects";
    }

    // Skills CRUD
    @GetMapping("/skills")
    public String listSkills(Model model) {
        model.addAttribute("skills", skillService.getAllSkills());
        return "admin/skills";
    }

    @GetMapping("/skills/add")
    public String showAddSkillForm(Model model) {
        model.addAttribute("skill", new SkillDTO());
        return "admin/skill-form";
    }

    @GetMapping("/skills/edit/{id}")
    public String showEditSkillForm(@PathVariable Long id, Model model) {
        model.addAttribute("skill", skillService.getSkillById(id));
        return "admin/skill-form";
    }

    @PostMapping("/skills/save")
    public String saveSkill(@Valid @ModelAttribute("skill") SkillDTO skillDTO,
                            BindingResult bindingResult, RedirectAttributes attributes) {
        if (bindingResult.hasErrors()) {
            return "admin/skill-form";
        }
        skillService.saveSkill(skillDTO);
        attributes.addFlashAttribute("success", "Skill saved successfully.");
        return "redirect:/admin/skills";
    }

    @GetMapping("/skills/delete/{id}")
    public String deleteSkill(@PathVariable Long id, RedirectAttributes attributes) {
        skillService.deleteSkill(id);
        attributes.addFlashAttribute("success", "Skill deleted successfully.");
        return "redirect:/admin/skills";
    }

    // Messages
    @GetMapping("/messages")
    public String listMessages(Model model) {
        model.addAttribute("messages", messageService.getAllMessages());
        return "admin/messages";
    }

    @GetMapping("/messages/delete/{id}")
    public String deleteMessage(@PathVariable Long id, RedirectAttributes attributes) {
        messageService.deleteMessage(id);
        attributes.addFlashAttribute("success", "Message deleted successfully.");
        return "redirect:/admin/messages";
    }
}
