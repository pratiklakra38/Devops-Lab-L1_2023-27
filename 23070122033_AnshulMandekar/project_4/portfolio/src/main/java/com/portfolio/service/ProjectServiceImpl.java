package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.entity.Project;
import com.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return convertToDTO(project);
    }

    @Override
    @Transactional
    public ProjectDTO saveProject(ProjectDTO dto) {
        Project project = Project.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .technologyStack(dto.getTechnologyStack())
                .githubUrl(dto.getGithubUrl())
                .demoUrl(dto.getDemoUrl())
                .imageUrl(dto.getImageUrl())
                .build();
        Project saved = projectRepository.save(project);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDTO convertToDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technologyStack(project.getTechnologyStack())
                .githubUrl(project.getGithubUrl())
                .demoUrl(project.getDemoUrl())
                .imageUrl(project.getImageUrl())
                .build();
    }
}
