package org.hokagex.ghostikxGoal.services.Implementation.file;

import io.minio.*;
import io.minio.messages.Item;
import org.hokagex.ghostikxGoal.exceptions.FileUploadException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.services.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class FileServiceImplWithMinio implements FileService {

    @Value("${minio.bucket}")
    private String bucket;

    private final MinioClient minioClient;

    public FileServiceImplWithMinio(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public void uploadSnapshot(String snapshotId, String noteId, Long userId, MultipartFile snapshot) {
        try {
            createBucket();
        } catch (Exception e) {
            throw new FileUploadException(e.getMessage());
        }

        if (snapshot.isEmpty() || snapshot.getOriginalFilename() == null || snapshot.getOriginalFilename().isEmpty())
            throw new FileUploadException("File is empty or without name");


        String filename = "/snapshots/" + snapshotId + ".json";
        InputStream inputStream;

        try {
            inputStream = snapshot.getInputStream();
        } catch (IOException e) {
            throw new FileUploadException("File upload failed: " + e.getMessage());
        }

        try {
            saveNoteFile(inputStream, filename, userId, noteId);
        } catch (Exception e) {
            throw new FileUploadException("File upload failed: " + e.getMessage());
        }

    }

    @Override
    public String uploadImages(List<MultipartFile> images, Long userId, String noteId) {
        try {
            createBucket();
        } catch (Exception e) {
            throw new FileUploadException("Image upload failed " + e.getMessage());
        }
        for (MultipartFile image : images) {
            if (image.isEmpty() || image.getOriginalFilename() == null)
                throw new FileUploadException("File is empty or without name");

            String[] typeParts = image.getContentType().split("/");
            String filename = "/images/" + image.getOriginalFilename() + "." + typeParts[1];
            InputStream inputStream;

            try {
                inputStream = image.getInputStream();
            } catch (IOException e) {
                throw new FileUploadException("Image upload failed " + e.getMessage());
            }

            try {
                saveNoteFile(inputStream, filename, userId, noteId);
            } catch (Exception e) {
                throw new FileUploadException("File upload failed: " + e.getMessage());
            }
        }
        return "Successfully uploaded " + images.toArray().length + " images";
    }

    @Override
    public InputStream getNoteFile(String fileName, Long userId, String noteId) {
        String path = "u-" + userId + "/notes/" + noteId;
        String objectName = path + "/" + fileName;
        try {
            return minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (Exception e) {
            throw new ResourcesNotFoundException(fileName);
        }
    }

    @Override
    public void deleteNoteFile(String fileName, Long userId, String noteId) {
        String path = "u-" + userId + "/notes/" + noteId;
        String objectName = path + "/" + fileName;
        try {
            minioClient.statObject(StatObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());

            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (Exception e) {
            throw new ResourcesNotFoundException(fileName);
        }
    }

    @Override
    public void deleteNoteFiles(List<String> filesName, Long userId, String noteId) {
        for (String fileName : filesName) {
            deleteNoteFile(fileName, userId, noteId);
        }
    }

    @Override
    public void deleteAllFilesInNote(String noteId, Long userId) {
        String prefix = "u-" + userId + "/notes/" + noteId;
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(
                    ListObjectsArgs.builder()
                            .bucket(bucket)
                            .prefix(prefix)
                            .recursive(true)
                            .build()
            );

            for (Result<Item> result : results) {
                String objectName = result.get().objectName();

                minioClient.removeObject(
                        RemoveObjectArgs.builder()
                                .bucket(bucket)
                                .object(objectName)
                                .build()
                );
            }
        } catch (Exception e) {
            throw new ResourcesNotFoundException(noteId);
        }
    }

    private void createBucket() throws Exception {
        if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }
    }

    private void saveNoteFile(InputStream inputStream, String fileName, Long userId, String noteId) {

        String userFolder = "u-" + userId + "/notes/" + noteId;
        String objectName = userFolder + fileName;

        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .stream(inputStream, inputStream.available(), -1)
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (Exception e) {
            throw new FileUploadException("File upload failed: " + e.getMessage());
        }
    }
}
