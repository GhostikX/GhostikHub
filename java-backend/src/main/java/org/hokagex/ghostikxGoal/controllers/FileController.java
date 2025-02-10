package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.hokagex.ghostikxGoal.services.FileService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;
    private final SessionValidation sessionValidation;

    public FileController(FileService fileService, SessionValidation sessionValidation) {
        this.fileService = fileService;
        this.sessionValidation = sessionValidation;
    }

    @PostMapping
    public String uploadFiles(@RequestParam("files") List<MultipartFile> files, @RequestParam("noteId") String noteId, HttpServletRequest request)
    {
        Long userId = sessionValidation.validateSession(request).id();
        return fileService.uploadImages(files, userId, noteId);
    }
}
