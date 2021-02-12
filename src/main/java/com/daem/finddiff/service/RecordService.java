package com.daem.finddiff.service;

import com.daem.finddiff.dao.GameSceneDataDao;
import com.daem.finddiff.dao.RecordDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.dto.TBodyDto;
import com.daem.finddiff.entity.GameSceneData;
import com.daem.finddiff.entity.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
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

    @Autowired
    private GameSceneDataDao gameSceneDataDao;

    public ResponseResult<Integer> saveRecord(List<Record> records) {
        try {
            List<Record> recordList = recordDao.saveAll(records);
            return ResponseResult.defSuccessful(recordList.size());
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Map<String, Object>> getRecordsByGameId(Integer gameId) {
        try {
            Map<String, Object> result = new LinkedHashMap<>();
            List<Record> records = recordDao.findAllByGameId(gameId);
            Map<Integer, Map<Integer, List<Record>>> roomMap = records.stream().collect(Collectors.groupingBy(Record::getRoomNum, Collectors.groupingBy(record -> record.getGameSceneData().getId())));
            int maxDiff = 0;
            for (int i = 0; i < records.size(); i++) {
                Record record = records.get(i);
                int size = record.getGameSceneData().getDiffsCoordinates().size();
                if (size > maxDiff)//将最大的关卡的不同数记录
                    maxDiff = size;
            }
            //表头
            Map<String, String> tHeads = new LinkedHashMap<>();
            tHeads.put("roomNum", "房间号");
            tHeads.put("gameScene", "关卡");
            tHeads.put("serialNum", "序号(游戏id)");
            tHeads.put("totalDiffNum", "总共的不同数");
            tHeads.put("hitDiffNum", "点中的不同数");
            for (int i = 1; i < maxDiff + 1; i++) {
                tHeads.put("hitNo" + i + "Diff", "点中第" + i + "处不同所花事件（s）");
                tHeads.put("hitNo" + i + "DiffPlayer", "点中第" + i + "处不同玩家");
            }
            tHeads.put("isSkip", "是否跳过的关卡");
            tHeads.put("lastToSkipHitNum", "最后一次点中到跳过的点击次数");
            tHeads.put("finishTime", "关卡完成的时间(s)");


            //表数据
            List<Map<String, String>> tBodyDtos = new LinkedList<>();
            //序号（玩家id）
            List<String> players = new ArrayList<>();

            for (Integer roomNum : roomMap.keySet()) {//遍历房间
                for (int i = 0; i < records.size(); i++) {//该房间中的玩家
                    Record record = records.get(i);
                    if (!players.contains(record.getSerial().getSerialNum() + "(" + record.getSerial().getUserName() + ")")) {
                        players.add(record.getSerial().getSerialNum() + "(" + record.getSerial().getUserName() + ")");
                    }
                }

                for (Integer gameSceneDataId : roomMap.get(roomNum).keySet()) {//遍历关卡
                    List<Record> recordsGroupByGameScene = roomMap.get(roomNum).get(gameSceneDataId);
                    Map<String, String> tBodyMap = new LinkedHashMap<>();
                    tBodyMap.put("roomNum", roomNum.toString());
                    GameSceneData gameSceneData = gameSceneDataDao.getOne(gameSceneDataId);
                    tBodyMap.put("gameScene", gameSceneData.getGameSceneName());
                    //拼接玩家
                    StringBuilder playersStr = new StringBuilder();
                    for (int i = 0; i < players.size(); i++) {
                        playersStr.append(players.get(i));
                        if (i < players.size() - 1)
                            playersStr.append(",");
                    }
                    tBodyMap.put("serialNum", playersStr.toString());
                    tBodyMap.put("totalDiffNum", String.valueOf(gameSceneData.getDiffsCoordinates().size()));
                    tBodyMap.put("hitDiffNum", String.valueOf(recordsGroupByGameScene.get(recordsGroupByGameScene.size() - 1).getDiffIndex()));
                    //循环生成第几次点中和点中玩家
                    int lastHitIndex = 0;
                    for (int i = 1; i < maxDiff + 1; i++) {
                        for (int j = 0; j < recordsGroupByGameScene.size(); j++) {
                            Record record = recordsGroupByGameScene.get(j);
                            if (record.getDiffIndex() == i) {
                                tBodyMap.put("hitNo" + i + "Diff", String.valueOf((record.getTime() - recordsGroupByGameScene.get(lastHitIndex).getTime()) / 1000));
                                tBodyMap.put("hitNo" + i + "DiffPlayer", record.getSerial().getSerialNum() + "(" + record.getSerial().getUserName() + ")");
                                lastHitIndex = j;
                                break;
                            }
                        }
                    }
                    if (gameSceneData.getDiffsCoordinates().size() > recordsGroupByGameScene.get(recordsGroupByGameScene.size() - 1).getDiffIndex()) {
                        for (int i = recordsGroupByGameScene.get(recordsGroupByGameScene.size() - 1).getDiffIndex() + 1; i <= gameSceneData.getDiffsCoordinates().size(); i++) {
                            tBodyMap.put("hitNo" + i + "Diff", "");
                            tBodyMap.put("hitNo" + i + "DiffPlayer", "");
                        }
                    }
                    for (Record record : recordsGroupByGameScene) {//当前关卡是否跳过
                        if (record.isSkip()) {
                            tBodyMap.put("isSkip", "跳过");
                            break;
                        }
                    }

                    if (recordsGroupByGameScene.get(recordsGroupByGameScene.size() - 1).getDiffIndex() < gameSceneData.getDiffsCoordinates().size()) {
                        long num = recordsGroupByGameScene.stream().filter(record -> record.getDiffIndex() == recordsGroupByGameScene.get(recordsGroupByGameScene.size() - 1).getDiffIndex()).count() - 2;
                        tBodyMap.put("lastToSkipHitNum", String.valueOf(num));
                    }
                    tBodyMap.put("finishTime", String.valueOf((recordsGroupByGameScene.get(recordsGroupByGameScene.size() - 1).getTime() - recordsGroupByGameScene.get(0).getTime()) / 1000));
                    tBodyDtos.add(tBodyMap);
                }
            }
            result.put("tHead", tHeads);
            result.put("tBody", tBodyDtos);
            return ResponseResult.defSuccessful(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }
}
