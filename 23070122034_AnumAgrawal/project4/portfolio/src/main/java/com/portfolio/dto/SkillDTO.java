package com.portfolio.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDTO {
    
    private Long id;

    @NotBlank(message = "Skill name is required")
    private String name;

    @NotNull(message = "Percentage is required")
    @Min(value = 0, message = "Percentage must be at least 0")
    @Max(value = 100, message = "Percentage cannot exceed 100")
    private Integer percentage;

    private String iconClass;
}
