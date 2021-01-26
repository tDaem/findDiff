package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @Description 文件上传控制器
 * @Author tyx
 * @Date 2021/1/26
 */
@RestController
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseResult<String> upload(MultipartFile file) {
        return fileUploadService.upload(file);
    }
}
