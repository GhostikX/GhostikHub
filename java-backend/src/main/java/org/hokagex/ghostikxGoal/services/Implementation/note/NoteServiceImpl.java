package org.hokagex.ghostikxGoal.services.Implementation.note;

import jakarta.persistence.Tuple;
import org.hokagex.ghostikxGoal.dto.note.NoteCreateRequest;
import org.hokagex.ghostikxGoal.dto.note.NoteDto;
import org.hokagex.ghostikxGoal.dto.note.NoteSnapshotData;
import org.hokagex.ghostikxGoal.dto.note.NoteUpdateRequest;
import org.hokagex.ghostikxGoal.exceptions.InvalidSessionException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.note.Note;
import org.hokagex.ghostikxGoal.models.note.Snapshot;
import org.hokagex.ghostikxGoal.models.user.UserEntity;
import org.hokagex.ghostikxGoal.repositories.NoteRepository;
import org.hokagex.ghostikxGoal.repositories.SnapshotRepository;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.services.FileService;
import org.hokagex.ghostikxGoal.services.noteServices.NoteService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NoteServiceImpl implements NoteService {

    private final ModelMapper modelMapper;
    private final NoteRepository noteRepository;
    private final UsersRepository usersRepository;
    private final FileService fileService;
    private final SnapshotRepository snapshotRepository;

    public NoteServiceImpl(ModelMapper modelMapper, NoteRepository noteRepository, UsersRepository usersRepository, FileService fileService, SnapshotRepository snapshotRepository) {
        this.modelMapper = modelMapper;
        this.noteRepository = noteRepository;
        this.usersRepository = usersRepository;
        this.fileService = fileService;
        this.snapshotRepository = snapshotRepository;
    }

    @Override
    public Page<NoteDto> getAllNotesByUserId(Long userId, Pageable pageable) {
        Page<Note> notePage = noteRepository.findAllByUserId(userId, pageable);
        return notePage.map(note -> modelMapper.map(note, NoteDto.class));
    }

    @Override
    public Page<NoteDto> getAllNotesStartingWithTitle(String title, Long userId, Pageable pageable) {
        Page<Note> notePage = noteRepository.findAllByTitleStartingWithAndUserId(title, userId, pageable);
        return notePage.map(note -> modelMapper.map(note, NoteDto.class));
    }

    @Override
    public Page<NoteDto> getAllNotesByTag(String tag, Long userId, Pageable pageable) {
        Page<Note> notePage = noteRepository.findAllByTagAndUserId(tag, userId, pageable);
        return notePage.map(note -> modelMapper.map(note, NoteDto.class));
    }

    @Override
    public List<NoteDto> getTop3RecentNotes(Long userId) {
        List<Note> notes = noteRepository.findTop3ByUserIdOrderByLastActivityDesc(userId);
        return notes.stream().map(note -> modelMapper.map(note, NoteDto.class)).collect(Collectors.toList());
    }


    @Override
    public NoteSnapshotData getNoteDataById(UUID noteId, Long userId) {
        usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        Note note = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));

        Tuple noteData = noteRepository.findNoteSnapshotDataByNoteId(userId, note.getId());

        note.setLastActivity(LocalDateTime.now());
        noteRepository.save(note);

        String snapshotId = noteData.get("snapshot_id", String.class);
        String[] assetsArray = noteData.get("assets", String[].class);
        List<String> assets = Arrays.stream(assetsArray).toList();

        return new NoteSnapshotData(snapshotId, assets);
    }

    @Override
    public NoteDto createNote(NoteCreateRequest createRequest, Long userId) {
        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        Note noteToCreate = modelMapper.map(createRequest, Note.class);

        noteToCreate.setNoteId(UUID.randomUUID());
        noteToCreate.setUser(user);
        noteToCreate.setCreatedAt(LocalDateTime.now());
        noteToCreate.setLastActivity(LocalDateTime.now());

        noteRepository.save(noteToCreate);

        return modelMapper.map(noteToCreate, NoteDto.class);
    }

    @Override
    public NoteDto updateNote(UUID noteId, NoteUpdateRequest updateRequest, Long userId) {
         usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        Note noteToUpdate = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));

        if (updateRequest.getTitle() != null)
            noteToUpdate.setTitle(updateRequest.getTitle());
        if (updateRequest.getTag() != null)
            noteToUpdate.setTag(updateRequest.getTag());

        noteRepository.save(noteToUpdate);

        return modelMapper.map(noteToUpdate, NoteDto.class);
    }

    @Override
    public void deleteNote(UUID noteId, Long userId) {
        Note noteToDelete = noteRepository.findByNoteId(noteId).
                orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));

        if (!noteToDelete.getUser().getId().equals(userId))
            throw new InvalidSessionException("Session is not valid or expired");

        Optional<Snapshot> snapshot = snapshotRepository.findByNoteId(noteToDelete.getId());
        if (snapshot.isPresent()) {
            try {
                fileService.deleteAllFilesInNote(noteId.toString(), userId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        noteRepository.delete(noteToDelete);
    }
}
