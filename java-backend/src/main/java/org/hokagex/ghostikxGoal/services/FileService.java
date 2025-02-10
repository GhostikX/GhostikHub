package org.hokagex.ghostikxGoal.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface FileService {
    void uploadSnapshot(String snapshotId, String noteId, Long userId, MultipartFile snapshot);
    String uploadImages(List<MultipartFile> images, Long userId, String noteId);
    InputStream getNoteFile(String fileName, Long userId, String noteId);
    void deleteNoteFile(String imageName, Long userId, String noteId);
    void deleteNoteFiles(List<String> filesName, Long userId, String noteI);
    void deleteAllFilesInNote(String noteId, Long userId);
}
