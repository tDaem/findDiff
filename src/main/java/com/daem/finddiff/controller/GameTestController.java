package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description
 * @Author tyx
 * @Date 2021/5/7
 */
@RestController
public class GameTestController {

    /**
     * 获取测试关卡
     * @return
     */
    @GetMapping("/game-test")
    public ResponseResult<Game> getTestGame(){
        return null;
    }

}
