package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @Description 配置相关的游戏数据控制器
 * @Author tyx
 * @Date 2021/1/26
 */
@RestController
public class GameController {

    @Autowired
    private GameService gameService;

    /**
     * 创建一个游戏实例
     *
     * @param game 要创建的游戏实例
     * @return 如果创建成功，泛型中返回true，否则false
     */
    @PostMapping(value = "/game", produces = "application/json;charset=UTF-8")
    public ResponseResult<Boolean> createGame(@RequestBody Game game) {
        return gameService.saveGame(game);
    }

    /**
     * 获取游戏实例
     *
     * @param id 该实例的id
     * @return 如果获取成功，泛型中返回true，否则false
     */
    @GetMapping(value = "/game/{id}")
    public ResponseResult<Game> getGame(@PathVariable Integer id) {
        return gameService.getGame(id);
    }

    /**
     * 删除游戏实例
     *
     * @param id 游戏id
     * @return 如果删除成功，泛型中返回true，否则false
     */
    @DeleteMapping(value = "/game")
    public ResponseResult<Boolean> delGame(Integer id) {
        return gameService.delGame(id);
    }

    /**
     * 更新游戏实例
     *
     * @param game 需要更新的游戏实例
     * @return 如果删除成功，泛型中返回true，否则false
     */
    @PutMapping(value = "/game", produces = "application/json;charset=UTF-8")
    public ResponseResult<Boolean> updateGame(@RequestBody Game game) {
        return gameService.updateGame(game);
    }
}
