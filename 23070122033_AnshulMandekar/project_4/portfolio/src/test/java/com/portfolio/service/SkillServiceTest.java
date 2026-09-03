package com.portfolio.service;

import com.portfolio.dto.SkillDTO;
import com.portfolio.entity.Skill;
import com.portfolio.repository.SkillRepository;
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
class SkillServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private SkillServiceImpl skillService;

    private Skill skill;
    private SkillDTO skillDTO;

    @BeforeEach
    void setUp() {
        skill = Skill.builder()
                .id(1L)
                .name("Java")
                .percentage(90)
                .iconClass("fab fa-java")
                .build();
                
        skillDTO = SkillDTO.builder()
                .id(1L)
                .name("Java")
                .percentage(90)
                .iconClass("fab fa-java")
                .build();
    }

    @Test
    void getAllSkills() {
        when(skillRepository.findAll()).thenReturn(Arrays.asList(skill));
        
        List<SkillDTO> result = skillService.getAllSkills();
        
        assertEquals(1, result.size());
        assertEquals(skill.getName(), result.get(0).getName());
    }

    @Test
    void getSkillById() {
        when(skillRepository.findById(1L)).thenReturn(Optional.of(skill));
        
        SkillDTO result = skillService.getSkillById(1L);
        
        assertNotNull(result);
        assertEquals(skill.getName(), result.getName());
    }

    @Test
    void saveSkill() {
        when(skillRepository.save(any(Skill.class))).thenReturn(skill);
        
        SkillDTO result = skillService.saveSkill(skillDTO);
        
        assertNotNull(result);
        assertEquals(skillDTO.getName(), result.getName());
    }

    @Test
    void deleteSkill() {
        doNothing().when(skillRepository).deleteById(1L);
        
        skillService.deleteSkill(1L);
        
        verify(skillRepository, times(1)).deleteById(1L);
    }
}
