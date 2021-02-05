package com.daem.finddiff.service;

import com.daem.finddiff.dto.ResponseResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class FileUploadService {

    @Value("${file.path}")
    private String filePath;

    public ResponseResult<String> upload(MultipartFile file) {
        try {
            String extName = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extName;
            FileCopyUtils.copy(file.getInputStream(), new FileOutputStream(new File(filePath + fileName)));
            return ResponseResult.defSuccessful("/upload/" + fileName);
        } catch (Exception e) {
            return ResponseResult.defFailed("文件上传失败！", e.getMessage());
        }

    }

}
