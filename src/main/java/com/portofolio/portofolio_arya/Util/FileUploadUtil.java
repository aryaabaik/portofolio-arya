package com.portofolio.portofolio_arya.Util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class FileUploadUtil {

    private static final String BASE_UPLOAD_DIR = "src/main/resources/static/images/";
    private static final String TARGET_BASE_DIR = "target/classes/static/images/";

    public static String saveFile(MultipartFile multipartFile) throws IOException {
        return saveFile("", multipartFile);
    }

    public static String saveFile(String subDir, MultipartFile multipartFile) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }

        String originalFileName = multipartFile.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            originalFileName = "uploaded_file.png";
        }

        // Clean filename from path traversal
        originalFileName = Paths.get(originalFileName).getFileName().toString();

        String extension = "";
        String baseName = originalFileName;
        int extIndex = originalFileName.lastIndexOf(".");
        if (extIndex >= 0) {
            extension = originalFileName.substring(extIndex);
            baseName = originalFileName.substring(0, extIndex);
        }

        // Sanitize base name to allow only safe characters
        String cleanBaseName = baseName.replaceAll("[^a-zA-Z0-9_-]", "_");
        String finalFileName = System.currentTimeMillis() + "_" + cleanBaseName + extension;

        String sub = (subDir != null && !subDir.trim().isEmpty())
                ? (subDir.endsWith("/") ? subDir : subDir + "/")
                : "";

        Path uploadPath = Paths.get(BASE_UPLOAD_DIR + sub);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path targetFilePath = uploadPath.resolve(finalFileName);
        try (InputStream inputStream = multipartFile.getInputStream()) {
            Files.copy(inputStream, targetFilePath, StandardCopyOption.REPLACE_EXISTING);
        }

        // Also copy to target/classes/static/images if it exists for immediate hot-serving
        try {
            Path targetClassDir = Paths.get(TARGET_BASE_DIR + sub);
            if (Files.exists(Paths.get(TARGET_BASE_DIR))) {
                if (!Files.exists(targetClassDir)) {
                    Files.createDirectories(targetClassDir);
                }
                try (InputStream inputStream = multipartFile.getInputStream()) {
                    Files.copy(inputStream, targetClassDir.resolve(finalFileName), StandardCopyOption.REPLACE_EXISTING);
                }
            }
        } catch (Exception ignored) {
            // Optional copy during runtime
        }

        return finalFileName;
    }
}
