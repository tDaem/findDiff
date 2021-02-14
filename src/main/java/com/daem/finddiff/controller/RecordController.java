package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Record;
import com.daem.finddiff.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/4
 */
@RestController
public class RecordController {

    @Autowired
    private RecordService recordService;

    @PostMapping(value = "/record")
    public ResponseResult<Integer> saveRecords(@RequestBody Record[] records) {
        return recordService.saveRecord(Arrays.asList(records));
    }

    @GetMapping(value = "/records")
    public ResponseResult<Map<String, Object>> getRecordsByGameId(Integer gameId){
        return recordService.getRecordsByGameId(gameId);
    }

    @DeleteMapping(value = "/record")
    public ResponseResult<Integer> delRecordByGameId(@RequestParam Integer gameId) {
        return recordService.delRecordByGameId(gameId);
    }

    @DeleteMapping(value = "/records")
    public ResponseResult<Integer> delAll() {
        return recordService.delAll();
    }
}
