package com.daem.finddiff.service;

import com.daem.finddiff.dao.GameDao;
import com.daem.finddiff.dao.GameGameSceneDataDao;
import com.daem.finddiff.dao.GameSceneDataDao;
import com.daem.finddiff.dao.SerialDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.entity.GameGameSceneData;
import com.daem.finddiff.entity.GameSceneData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @Autowired
    private GameGameSceneDataDao gameGameSceneDataDao;

    @Autowired
    private GameSceneDataDao gameSceneDataDao;


    @Transactional
    public ResponseResult<Game> saveGame(Game game) {
        if (game.isTest()) {//确保只有一个只玩游戏
            gameDao.setAllGamesNotTest();
        }
        Game game1 = gameDao.save(game);
        return ResponseResult.defSuccessful(game1);
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
                Game game = optionalGame.get();
                List<GameGameSceneData> gameGameSceneDatas = gameGameSceneDataDao.getAllByGameId(id);
                List<GameSceneData> sortedGameScenes = new ArrayList<>();
                gameGameSceneDatas.forEach(gameGameSceneData -> {
                    sortedGameScenes.add(gameSceneDataDao.getOne(gameGameSceneData.getGameGameSceneDataUPK().getGameSceneDataId()));
                });

                game.setGameSceneDatas(sortedGameScenes);
                return ResponseResult.defSuccessful(game);
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
            serialDao.findAllByGame_Id(id).forEach(serial -> {
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
            List<Game> all = gameDao.getGamesNoTest();
            return ResponseResult.defSuccessful(all);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Boolean> delGames(Integer[] ids) {
        serialDao.updateByIds(ids);
        gameDao.delAllByIds(ids);
        return ResponseResult.defSuccessful();

    }

    public ResponseResult<Game> getTestGame() {
        return ResponseResult.defSuccessful(gameDao.getGameByTest(true));
    }
}
