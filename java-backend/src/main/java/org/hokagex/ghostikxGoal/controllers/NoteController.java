package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.hokagex.ghostikxGoal.dto.note.NoteCreateRequest;
import org.hokagex.ghostikxGoal.dto.note.NoteDto;
import org.hokagex.ghostikxGoal.dto.note.NoteSnapshotData;
import org.hokagex.ghostikxGoal.dto.note.NoteUpdateRequest;
import org.hokagex.ghostikxGoal.services.noteServices.NoteService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/notes")
public class NoteController {

    private final SessionValidation sessionValidation;
    private final NoteService noteService;

    public NoteController(SessionValidation sessionValidation, NoteService noteService) {
        this.sessionValidation = sessionValidation;
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<Page<NoteDto>> getNotes(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "5") Integer size,
            HttpServletRequest request)
    {
        Long userId = sessionValidation.validateSession(request).id();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        Page<NoteDto> notePage = noteService.getAllNotesByUserId(userId, pageable);
        return ResponseEntity.ok(notePage);
    }

    @GetMapping("/searchByTitle/{title}")
    public ResponseEntity<Page<NoteDto>> getAllNotesByTitle(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "5") Integer size,
            @PathVariable("title") String title,
            HttpServletRequest request)
    {
        Long userId = sessionValidation.validateSession(request).id();
        Pageable pageable = PageRequest.of(page, size);
        Page<NoteDto> notePage = noteService.getAllNotesStartingWithTitle(title, userId, pageable);
        return ResponseEntity.ok(notePage);
    }

    @GetMapping("/searchByTag/{tag}")
    public ResponseEntity<Page<NoteDto>> getAllNotesByTag(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "5") Integer size,
            @PathVariable("tag") String tag,
            HttpServletRequest request)
    {
        Long userId = sessionValidation.validateSession(request).id();
        Pageable pageable = PageRequest.of(page, size);
        Page<NoteDto> notePage = noteService.getAllNotesByTag(tag, userId, pageable);
        return ResponseEntity.ok(notePage);
    }


    @GetMapping("/getNoteData/{noteId}")
    public ResponseEntity<NoteSnapshotData> getNoteData(@PathVariable UUID noteId, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        NoteSnapshotData noteSnapshotData = noteService.getNoteDataById(noteId, userId);
        return ResponseEntity.ok(noteSnapshotData);
    }

    @PostMapping
    public ResponseEntity<NoteDto> createNote(@RequestBody NoteCreateRequest createRequest, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();

        NoteDto note = noteService.createNote(createRequest, userId);
        return new ResponseEntity<>(note, HttpStatus.CREATED);
    }

    @PatchMapping("/{noteId}")
    public ResponseEntity<NoteDto> updateNote(@PathVariable UUID noteId, @RequestBody NoteUpdateRequest updateRequest, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        NoteDto note = noteService.updateNote(noteId, updateRequest, userId);
        return new ResponseEntity<>(note, HttpStatus.OK);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<String> deleteNote(@PathVariable UUID noteId, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();

        noteService.deleteNote(noteId, userId);
        return ResponseEntity.ok("Successfully deleted note");
    }
}
