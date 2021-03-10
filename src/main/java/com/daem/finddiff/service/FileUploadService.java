package com.daem.finddiff.service;

import com.daem.finddiff.dto.ResponseResult;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Objects;
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

    @Value("${img.imgWidth}")
    private int imgWidth;

    @Value("${img.imgHeight}")
    private int imgHeight;

    public ResponseResult<String> upload(MultipartFile file) {
        try {
            Assert.notNull(file, "file is null");
            String extName = Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extName;
            BufferedImage read = ImageIO.read(file.getInputStream());
            if (read.getWidth() > read.getHeight())
                Thumbnails.of(file.getInputStream()).size(imgWidth, imgHeight)/*.outputQuality(0.5)*/.toFile(new File(filePath + fileName));
            else
                Thumbnails.of(file.getInputStream()).size(imgHeight, imgWidth)/*.outputQuality(0.5)*/.toFile(new File(filePath + fileName));
//            FileCopyUtils.copy(file.getInputStream(), new FileOutputStream(new File(filePath + fileName)));
            return ResponseResult.defSuccessful("/upload/" + fileName);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("文件上传失败！", e.getMessage());
        }

    }

}
