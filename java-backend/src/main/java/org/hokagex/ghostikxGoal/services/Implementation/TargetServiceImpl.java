package org.hokagex.ghostikxGoal.services.Implementation;

import org.hokagex.ghostikxGoal.dto.TargetDto;
import org.hokagex.ghostikxGoal.exceptions.InvalidSessionException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.Target;
import org.hokagex.ghostikxGoal.models.user.UserEntity;
import org.hokagex.ghostikxGoal.repositories.TargetRepository;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.services.targetServices.TargetService;
import org.hokagex.ghostikxGoal.services.targetServices.TaskService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TargetServiceImpl implements TargetService {
    private final UsersRepository usersRepository;
    private final TargetRepository targetRepository;
    private final TaskService taskService;
    private final ModelMapper modelMapper;

    public TargetServiceImpl(UsersRepository usersRepository, TargetRepository targetRepository, TaskService taskService, ModelMapper modelMapper) {
        this.usersRepository = usersRepository;
        this.targetRepository = targetRepository;
        this.taskService = taskService;
        this.modelMapper = modelMapper;
    }

    @Override
    public Page<TargetDto> getAllTargets(Long userId, Pageable pageable) {
        usersRepository.findById(userId).orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        Page<Target> targets = targetRepository.findAllByUserId(userId, pageable);
        List<Target> completedTargets = targets.getContent().stream()
                .peek(target -> target.setProgress(taskService.countTargetProgress(target.getId())))
                .collect(Collectors.toList());

        if (!completedTargets.isEmpty()) targetRepository.saveAll(completedTargets);

        List<TargetDto> targetDto = targets.stream().
                map((target -> modelMapper.map(target, TargetDto.class))).collect(Collectors.toList());
        return new PageImpl<>(targetDto, pageable, targets.getTotalElements());
    }

    @Override
    public List<TargetDto> getAllTargetsByDeadline(Long userId, Integer limit) {
        UserEntity user = usersRepository.findById(userId).orElseThrow(() -> new ResourcesNotFoundException("User", userId));
        List<Target> targets = targetRepository.findAllByUserIdAndSortedByDeadline(userId, limit);
        return targets.stream()
                .map(target -> modelMapper.map(target, TargetDto.class)).collect(Collectors.toList());
    }

    @Override
    public TargetDto getTargetById(Long targetId, Long userId) {
        Target target = targetRepository.findById(targetId)
                .orElseThrow(() -> new ResourcesNotFoundException("Target", targetId));
        if (!target.getUser().getId().equals(userId))
            throw new InvalidSessionException("Session expired or not valid");

        return modelMapper.map(target, TargetDto.class);
    }

    @Override
    public TargetDto createTarget(TargetDto createRequest, Long userId) {
        UserEntity user = usersRepository.findById(userId).orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        Target target = modelMapper.map(createRequest, Target.class);
        target.setUser(user);
        target.setCreatedAt(LocalDateTime.now());
        target.setTasksCount(0);
        target.setProgress(0);

        targetRepository.save(target);

        return modelMapper.map(target, TargetDto.class);
    }

    @Override
    public TargetDto updateTarget(TargetDto updateRequest, Long targetId, Long userId) {
        usersRepository.findById(userId).orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        Target currentTarget = targetRepository.findById(targetId)
                .orElseThrow(() -> new ResourcesNotFoundException("Target", targetId));

        if (updateRequest.getTitle() != null)
            currentTarget.setTitle(updateRequest.getTitle());
        if (updateRequest.getDeadline() != null)
            currentTarget.setDeadline(updateRequest.getDeadline());

        targetRepository.save(currentTarget);

        return modelMapper.map(currentTarget, TargetDto.class);
    }

    @Override
    public void deleteTarget(Long targetId, Long userId) {
        usersRepository.findById(userId).orElseThrow(() -> new ResourcesNotFoundException("User", userId));
        targetRepository.findById(targetId).orElseThrow(() -> new ResourcesNotFoundException("Target", targetId));

        targetRepository.deleteById(targetId);
    }
}
