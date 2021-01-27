package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.entity.Serial;
import com.daem.finddiff.service.SerialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    /**
     * 新建一个序列号
     * @param serialNum
     * @return
     */
    @PostMapping(value = "/serial", produces = "application/json;charset=UTF-8")
    public ResponseResult<Boolean> createSerial(@RequestBody Serial serialNum){
        return serialService.createSerial(serialNum);
    }

    /**
     * 删除序列号实例
     *
     * @param id 序列号id
     * @return 如果删除成功，泛型中返回true，否则false
     */
    @DeleteMapping(value = "/serial")
    public ResponseResult<Boolean> delSerial(Integer id) {
        return serialService.delSerial(id);
    }

    /**
     * 更新序列号实例
     *
     * @param serial 需要更新的序列号实例
     * @return 如果删除成功，泛型中返回true，否则false
     */
    @PutMapping(value = "/serial", produces = "application/json;charset=UTF-8")
    public ResponseResult<Boolean> updateSerial(@RequestBody Serial serial) {
        return serialService.updateSerial(serial);
    }
}
