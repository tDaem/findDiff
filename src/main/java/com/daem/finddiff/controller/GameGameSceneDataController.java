package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.GameGameSceneData;
import com.daem.finddiff.service.GameGameSceneDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Description 游戏与关卡第三张表操纵控制器  （主要用于排序）
 * @Author tyx
 * @Date 2021/4/9
 */
@RestController
public class GameGameSceneDataController {

    @Autowired
    private GameGameSceneDataService gameGameSceneDataService;

    @PostMapping(value = "/gameGameSceneDatas", produces = "application/json;charset=UTF-8")
    public ResponseResult<Boolean> saveAll(@RequestBody List<GameGameSceneData> gameGameSceneDatas) {
        return gameGameSceneDataService.saveAll(gameGameSceneDatas);
    }

}
