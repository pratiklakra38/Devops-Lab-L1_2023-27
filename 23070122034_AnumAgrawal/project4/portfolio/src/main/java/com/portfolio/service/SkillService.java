package com.portfolio.service;

import com.portfolio.dto.SkillDTO;
import java.util.List;

public interface SkillService {
    List<SkillDTO> getAllSkills();
    SkillDTO getSkillById(Long id);
    SkillDTO saveSkill(SkillDTO skillDTO);
    void deleteSkill(Long id);
}
