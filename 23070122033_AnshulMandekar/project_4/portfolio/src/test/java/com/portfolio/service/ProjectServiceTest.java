package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.entity.Project;
import com.portfolio.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project project;
    private ProjectDTO projectDTO;

    @BeforeEach
    void setUp() {
        project = Project.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .technologyStack("Java, Spring Boot")
                .build();
                
        projectDTO = ProjectDTO.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .technologyStack("Java, Spring Boot")
                .build();
    }

    @Test
    void getAllProjects() {
        when(projectRepository.findAll()).thenReturn(Arrays.asList(project));
        
        List<ProjectDTO> result = projectService.getAllProjects();
        
        assertEquals(1, result.size());
        assertEquals(project.getTitle(), result.get(0).getTitle());
    }

    @Test
    void getProjectById() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        
        ProjectDTO result = projectService.getProjectById(1L);
        
        assertNotNull(result);
        assertEquals(project.getTitle(), result.getTitle());
    }

    @Test
    void saveProject() {
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        
        ProjectDTO result = projectService.saveProject(projectDTO);
        
        assertNotNull(result);
        assertEquals(projectDTO.getTitle(), result.getTitle());
    }

    @Test
    void deleteProject() {
        doNothing().when(projectRepository).deleteById(1L);
        
        projectService.deleteProject(1L);
        
        verify(projectRepository, times(1)).deleteById(1L);
    }
}
