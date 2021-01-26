package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Serial;
import com.daem.finddiff.service.SerialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description 序列号控制器
 * @Author tyx
 * @Date 2021/1/26
 */
@RestController
public class SerialController {

    @Autowired
    private SerialService serialService;

    @GetMapping("/serial")
    public ResponseResult<Serial> getSerialBySerial(String serial){
        return serialService.getSerialBySerial(serial);
    }
}
