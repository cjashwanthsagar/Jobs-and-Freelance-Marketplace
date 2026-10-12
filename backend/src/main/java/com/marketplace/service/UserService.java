package com.marketplace.service;

import com.marketplace.dto.ProfileUpdateRequest;
import com.marketplace.dto.UserDto;
import com.marketplace.entity.Skill;
import com.marketplace.entity.User;
import com.marketplace.entity.UserProfile;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.SkillRepository;
import com.marketplace.repository.UserProfileRepository;
import com.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final SkillRepository skillRepository;
    private final DtoMapper dtoMapper;

    public UserService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       SkillRepository skillRepository,
                       DtoMapper dtoMapper) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.skillRepository = skillRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return dtoMapper.toUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, ProfileUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (StringUtils.hasText(req.getFullName())) {
            user.setFullName(req.getFullName().trim());
        }

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile(user);
        }

        if (req.getHeadline() != null) profile.setHeadline(req.getHeadline());
        if (req.getBio() != null) profile.setBio(req.getBio());
        if (req.getLocation() != null) profile.setLocation(req.getLocation());
        if (req.getPhone() != null) profile.setPhone(req.getPhone());
        if (req.getWebsite() != null) profile.setWebsite(req.getWebsite());
        if (req.getGithub() != null) profile.setGithub(req.getGithub());
        if (req.getLinkedin() != null) profile.setLinkedin(req.getLinkedin());
        if (req.getHourlyRate() != null) profile.setHourlyRate(req.getHourlyRate());
        if (req.getExperienceYears() != null) profile.setExperienceYears(req.getExperienceYears());
        if (req.getEducation() != null) profile.setEducation(req.getEducation());
        if (req.getAvatarUrl() != null) profile.setAvatarUrl(req.getAvatarUrl());

        userProfileRepository.save(profile);
        user.setProfile(profile);

        if (req.getSkills() != null) {
            Set<Skill> skillSet = new HashSet<>();
            for (String skillName : req.getSkills()) {
                if (StringUtils.hasText(skillName)) {
                    String cleanName = skillName.trim();
                    Skill skill = skillRepository.findByNameIgnoreCase(cleanName)
                            .orElseGet(() -> skillRepository.save(new Skill(cleanName)));
                    skillSet.add(skill);
                }
            }
            user.setSkills(skillSet);
        }

        User updatedUser = userRepository.save(user);
        return dtoMapper.toUserDto(updatedUser);
    }
}
