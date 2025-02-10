package org.hokagex.ghostikxGoal.services.Implementation.file;


import org.hokagex.ghostikxGoal.exceptions.FileUploadException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.services.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;

import static software.amazon.awssdk.core.sync.RequestBody.fromInputStream;


import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;


public class FileServiceImplWithAWS implements FileService {

    @Value("${aws.bucket}")
    private String bucket;

    private final S3Client s3Client;

    public FileServiceImplWithAWS(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public void uploadSnapshot(String snapshotId, String noteId, Long userId, MultipartFile snapshot) {
        if (snapshot.isEmpty() || snapshot.getOriginalFilename() == null || snapshot.getOriginalFilename().isEmpty())
            throw new FileUploadException("File is empty or without name");

        String filename = "/snapshots/" + snapshotId + ".json";

        try (InputStream inputStream = snapshot.getInputStream()) {
            saveNoteFile(inputStream, filename, userId, noteId, snapshot.getContentType());
        } catch (IOException e) {
            throw new IllegalArgumentException("File upload failed: " + e.getMessage(), e);
        }

    }

    @Override
    public String uploadImages(List<MultipartFile> images, Long userId, String noteId) {
        for (MultipartFile image : images) {
            if (image.isEmpty() || image.getOriginalFilename() == null)
                throw new FileUploadException("File is empty or without name");

            String[] typeParts = image.getContentType().split("/");
            String filename = "/images/" + image.getOriginalFilename() + "." + typeParts[1];

            try (InputStream inputStream = image.getInputStream()) {
                saveNoteFile(inputStream, filename, userId, noteId, image.getContentType());
            } catch (IOException e) {
                throw new IllegalArgumentException("File upload failed: " + e.getMessage(), e);
            }
        }
        return "Successfully uploaded " + images.toArray().length + " images";
    }

    @Override
    public InputStream getNoteFile(String fileName, Long userId, String noteId) {
        String path = "u-" + userId + "/notes/" + noteId;
        String objectName = path + fileName;

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectName)
                    .build();

            return s3Client.getObject(getObjectRequest);
        } catch (Exception e) {
            throw new ResourcesNotFoundException(fileName);
        }
    }

    @Override
    public void deleteNoteFile(String fileName, Long userId, String noteId) {
        String path = "u-" + userId + "/notes/" + noteId;
        String objectName = path + "/" + fileName;
        try {
            s3Client.headObject(builder -> builder.bucket(bucket).key(objectName).build());

            s3Client.deleteObject(builder -> builder.bucket(bucket).key(objectName).build());
        } catch (Exception e) {
            throw new ResourcesNotFoundException(fileName);
        }
    }

    @Override
    public void deleteNoteFiles(List<String> filesName, Long userId, String noteId) {
        String path = "u-" + userId + "/notes/" + noteId;
        List<ObjectIdentifier> objectsToDelete = filesName.stream()
                .map(fileName -> ObjectIdentifier.builder().key(path + "/" + fileName).build())
                .collect(Collectors.toList());

        DeleteObjectsRequest deleteObjectsRequest = DeleteObjectsRequest.builder()
                .bucket(bucket)
                .delete(Delete.builder().objects(objectsToDelete).build())
                .build();
        try {
            s3Client.deleteObjects(deleteObjectsRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("Failed to delete files", e);
        }
    }

    @Override
    public void deleteAllFilesInNote(String noteId, Long userId) {
        String prefix = "u-" + userId + "/notes/" + noteId;
        try {
            ListObjectsV2Request listObjects = ListObjectsV2Request.builder()
                    .bucket(bucket)
                    .prefix(prefix)
                    .build();

            ListObjectsV2Response response = s3Client.listObjectsV2(listObjects);

            List<ObjectIdentifier> objectsToDelete = response.contents().stream()
                    .map(s3Object -> ObjectIdentifier.builder().key(s3Object.key()).build())
                    .collect(Collectors.toList());

            if (!objectsToDelete.isEmpty()) {
                DeleteObjectsRequest deleteObjectsRequest = DeleteObjectsRequest.builder()
                        .bucket(bucket)
                        .delete(Delete.builder().objects(objectsToDelete).build())
                        .build();

                s3Client.deleteObjects(deleteObjectsRequest);
            }
        } catch (Exception e) {
            throw new ResourcesNotFoundException(noteId);
        }
    }

    private void saveNoteFile(InputStream inputStream, String fileName, Long userId, String noteId, String contentType) {
        String userFolder = "u-" + userId + "/notes/" + noteId;
        String objectName = userFolder + fileName;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(objectName)
                            .contentType(contentType)
                            .build();
            s3Client.putObject(
                    putObjectRequest,
                    fromInputStream(inputStream, inputStream.available())
            );
        } catch (Exception e) {
            throw new FileUploadException("File upload failed: " + e.getMessage());
        }
    }
}
