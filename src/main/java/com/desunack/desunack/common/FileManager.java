package com.desunack.desunack.common;

import jakarta.servlet.ServletContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
public class FileManager {

    // application.properties에서 설정한 경로 주입
    @Value("${file.upload.path}")
    private String uploadPath;

    //    @Autowired
//    private ServletContext servletContext;

    // 파일이 저장될 기본 경로
//    private final String basePath = "src/main/resources/img/";

    // @param file : 업로드할 파일
    // @param subPath : 파일을 저장할 하위 경로
    // 판매자 사업자등록증 파일 저장
    public String saveFile(MultipartFile file, String subPath) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

    // 파일이 저장될 실제 경로
    String realPath = uploadPath + subPath;

        // 파일명 가져온 뒤 확장자 파악 후 고유한 UUID 파일명 생성
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;

        // 실제 파일을 저장한 경로 지정
        // 파일 저장 경로 설정 및 없다면 디렉토리 생성
        File uploadDir = new File(realPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        // 메모리 -> 실제 파일로 저장
        File destinationFile = new File(realPath + uniqueFileName);
        file.transferTo(destinationFile);

        log.info("파일 저장 완료: {}", destinationFile.getAbsolutePath());

        // DB로 저장할 상대 경로 반환
        return "/img/" + subPath + uniqueFileName;
    }

    // 파일 확장자 추출하는 메소드
    private String getFileExtension(String fileName) {
        int index = fileName.lastIndexOf(".");
        if (fileName == null || index == -1) {
            return "";
        }
        return fileName.substring(index + 1);
    }

    public void deleteFile(String filePath, String subPath) {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }
//        String realPath = null;
//        if (servletContext != null) {
//            realPath = servletContext.getRealPath(filePath);
//        }

        // 웹 접근 경로를 실제 서버 경로로 전환
        // 파일 경로에서 파일명만 추출
        String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);



        // 실제 파일 경로 생성
        File fileToDelete = new File(uploadPath + subPath + fileName);

        if (fileToDelete.exists()) {
            if (fileToDelete.delete()) {
                log.info("파일 삭제 성공: {}", filePath);
            } else {
                log.error("파일 삭제 실패: {}", filePath);
            }
        } else {
            log.warn("삭제하려는 파일이 존재하지 않습니다: {}", filePath);
        }
    }
}
