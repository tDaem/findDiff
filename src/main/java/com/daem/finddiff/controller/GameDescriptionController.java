package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.GameDescription;
import com.daem.finddiff.service.GameDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description
 * @Author tyx
 * @Date 2021/5/5
 */
@RestController
public class GameDescriptionController {

    @Autowired
    private GameDescriptionService gameDescriptionService;

    @PostMapping("/game-description")
    public ResponseResult<?> saveGameDescription(@RequestBody GameDescription gameDescription) {
        return gameDescriptionService.saveGameDescription(gameDescription);
    }

    @GetMapping("/game-description")
    public ResponseResult<?> getGameDescription(){
        return gameDescriptionService.getGameDescription();
    }

}
