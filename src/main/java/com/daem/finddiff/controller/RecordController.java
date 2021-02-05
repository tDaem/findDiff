package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Record;
import com.daem.finddiff.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/4
 */
@RestController
public class RecordController {

    @Autowired
    private RecordService recordService;
    /**
     * 创建一个游戏实例
     *
     * @param records 要保存的数据
     * @return
     */
    @PostMapping(value = "/record"/*, produces = "application/json;charset=UTF-8"*/)
    public ResponseResult<Integer> createGame(@RequestBody Record[] records) {
        return recordService.saveRecord(Arrays.asList(records));
    }
}
