package com.daem.finddiff.service;

import com.daem.finddiff.dao.GameDao;
import com.daem.finddiff.dao.SerialDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.entity.Serial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class GameService {

    @Autowired
    private GameDao gameDao;

    @Autowired
    private SerialDao serialDao;


    public ResponseResult<Game> saveGame(Game game) {
        try {
            Game game1 = gameDao.save(game);
            return ResponseResult.defSuccessful(game1);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    /**
     * 根据游戏id获取游戏数据
     *
     * @param id 游戏主键
     * @return 游戏实体
     */
    public ResponseResult<Game> getGame(Integer id) {
        try {
            Optional<Game> optionalGame = gameDao.findById(id);
            if (optionalGame.isPresent()) {
                return ResponseResult.defSuccessful(optionalGame.get());
            }
            return ResponseResult.defFailed("该游戏数据可能已被删除！");
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    /**
     * 根据游戏id删除游戏数据
     *
     * @param id
     * @return
     */
    public ResponseResult<Boolean> delGame(Integer id) {
        try {
            serialDao.findAllByGame_Id(id).stream().forEach(serial -> {
                serial.setGame(null);
                serialDao.save(serial);
            });
            gameDao.deleteById(id);
            return ResponseResult.defSuccessful(true);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    /**
     * 更新游戏数据
     *
     * @param game
     * @return
     */
    public ResponseResult<Game> updateGame(Game game) {
        try {
            Game game1 = gameDao.save(game);
            return ResponseResult.defSuccessful(game1);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<List<Game>> getGames() {
        try {
            List<Game> all = gameDao.findAll();
            return ResponseResult.defSuccessful(all);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Boolean> delGames(Integer[] ids) {
        try {
            serialDao.updateByIds(ids);
            gameDao.delAllByIds(ids);
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }
}
