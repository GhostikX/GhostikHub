package org.hokagex.ghostikxGoal.services.targetServices;

import org.hokagex.ghostikxGoal.dto.TargetDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TargetService {
    Page<TargetDto> getAllTargets(Long userId, Pageable pageable);
    List<TargetDto> getAllTargetsByDeadline(Long userId, Integer limit);
    TargetDto getTargetById(Long targetId, Long userId);
    TargetDto createTarget(TargetDto createRequest, Long userId);
    TargetDto updateTarget(TargetDto updateRequest, Long targetId, Long userId);
    void deleteTarget(Long targetId, Long userId);

}
