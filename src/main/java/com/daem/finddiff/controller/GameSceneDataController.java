package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.GameSceneData;
import com.daem.finddiff.service.GameSceneDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Description 配置相关的游戏数据控制器
 * @Author tyx
 * @Date 2021/1/26
 */
@RestController
public class GameSceneDataController {

    @Autowired
    private GameSceneDataService gameSceneDataService;

    /**
     * 创建一个游戏实例
     *
     * @param gameSceneData 要创建的实例
     * @return 如果创建成功，泛型中返回true，否则false
     */
    @PostMapping(value = "/gameSceneData",produces = "application/json;charset=UTF-8")
    public ResponseResult<GameSceneData> createGameSceneData(@RequestBody GameSceneData gameSceneData) {
        return gameSceneDataService.saveGameSceneData(gameSceneData);
    }

    @PutMapping(value = "/gameSceneData",produces = "application/json;charset=UTF-8")
    public ResponseResult<GameSceneData> updateGameSceneData(@RequestBody GameSceneData gameSceneData) {
        return gameSceneDataService.saveGameSceneData(gameSceneData);
    }


    @GetMapping(value = "/gameSceneDatas")
    public ResponseResult<List<GameSceneData>> getAllGameSceneData(){
        return gameSceneDataService.getAllGameSceneData();
    }

    @GetMapping(value = "/gameSceneDatasByGameId")
    public ResponseResult<List<GameSceneData>> getAllGameSceneDataByGameId(Integer gameId){
        return gameSceneDataService.getAllGameSceneDataByGameId(gameId);
    }

    @GetMapping(value = "/gameSceneData/{id}")
    public ResponseResult<GameSceneData> getGameSceneData(@PathVariable Integer id){
        return gameSceneDataService.getGameSceneData(id);
    }

    @DeleteMapping(value = "/gameSceneData/{id}")
    public ResponseResult<GameSceneData> deleteGameSceneData(@PathVariable Integer id){
        return gameSceneDataService.delGameSceneData(id);
    }

    @PostMapping(value = "/gameSceneDatas")
    public ResponseResult<Boolean> deleteAllGameSceneData(@RequestBody Integer[] ids) {
        return gameSceneDataService.deleteAllGameSceneData(ids);
    }
}
