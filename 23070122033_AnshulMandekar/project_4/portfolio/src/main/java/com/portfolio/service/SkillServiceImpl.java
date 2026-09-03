package com.portfolio.service;

import com.portfolio.dto.SkillDTO;
import com.portfolio.entity.Skill;
import com.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    public SkillServiceImpl(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SkillDTO getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        return convertToDTO(skill);
    }

    @Override
    @Transactional
    public SkillDTO saveSkill(SkillDTO dto) {
        Skill skill = Skill.builder()
                .id(dto.getId())
                .name(dto.getName())
                .percentage(dto.getPercentage())
                .iconClass(dto.getIconClass())
                .build();
        Skill saved = skillRepository.save(skill);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }

    private SkillDTO convertToDTO(Skill skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .name(skill.getName())
                .percentage(skill.getPercentage())
                .iconClass(skill.getIconClass())
                .build();
    }
}
