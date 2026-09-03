package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import java.util.List;

public interface ProjectService {
    List<ProjectDTO> getAllProjects();
    ProjectDTO getProjectById(Long id);
    ProjectDTO saveProject(ProjectDTO projectDTO);
    void deleteProject(Long id);
}
