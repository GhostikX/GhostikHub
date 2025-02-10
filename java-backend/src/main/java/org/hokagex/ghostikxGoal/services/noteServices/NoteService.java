package org.hokagex.ghostikxGoal.services.noteServices;

import org.hokagex.ghostikxGoal.dto.note.NoteCreateRequest;
import org.hokagex.ghostikxGoal.dto.note.NoteDto;
import org.hokagex.ghostikxGoal.dto.note.NoteSnapshotData;
import org.hokagex.ghostikxGoal.dto.note.NoteUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface NoteService {

    Page<NoteDto> getAllNotesByUserId(Long userId, Pageable pageable);
    Page<NoteDto> getAllNotesStartingWithTitle(String title, Long userId, Pageable pageable);
    Page<NoteDto> getAllNotesByTag(String tag, Long userId, Pageable pageable);
    List<NoteDto> getTop3RecentNotes(Long userId);
    NoteSnapshotData getNoteDataById(UUID noteId, Long userId);
    NoteDto createNote(NoteCreateRequest createRequest, Long userId);
    NoteDto updateNote(UUID noteId, NoteUpdateRequest updateRequest, Long userId);
    void deleteNote(UUID noteId, Long userId);
}
