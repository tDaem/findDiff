package com.daem.finddiff.service;

import com.daem.finddiff.dao.RecordDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.entity.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/4
 */
@Service
public class RecordService {

    @Autowired
    private RecordDao recordDao;

    public ResponseResult<Integer> saveRecord(List<Record> records) {
        try {
            List<Record> recordList = recordDao.saveAll(records);
            return ResponseResult.defSuccessful(recordList.size());
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Map<Integer,Map<Integer,List<Record>>>> getRecordsByGameId(Integer gameId) {
        try {
            List<Record> records = recordDao.findAllBySerial_Game_Id(gameId);
            Map<Integer, Map<Integer, List<Record>>> collect = records.stream().collect(Collectors.groupingBy(Record::getRoomNum, Collectors.groupingBy(record -> record.getGameSceneData().getId())));
            return ResponseResult.defSuccessful(collect);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }
}
