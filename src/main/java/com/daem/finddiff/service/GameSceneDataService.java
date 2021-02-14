package com.daem.finddiff.service;

import com.daem.finddiff.dao.*;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class GameSceneDataService {

    @Autowired
    private GameSceneDataDao gameSceneDataDao;

    @Autowired
    private GameDao gameDao;

    @Autowired
    private DiffsCoordinateDao diffsCoordinateDao;

    @Autowired
    private RecordDao recordDao;

    private SerialDao serialDao;

    @Value("${file.path}")
    private String imgPath;

    @Transactional
    public ResponseResult<GameSceneData> saveGameSceneData(GameSceneData gameSceneData) {
        try {
            String imgUrl = gameSceneData.getImgPath();
            BufferedImage image = ImageIO.read(new File(this.imgPath + imgUrl.replace("/upload/", "")));
            if (image.getWidth() > image.getHeight()) {
                gameSceneData.setStructure(Structure.LEFT_AND_RIGHT);
            } else {
                gameSceneData.setStructure(Structure.UP_AND_DOWN);
            }
            GameSceneData result = gameSceneDataDao.save(gameSceneData);
            return ResponseResult.defSuccessful(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    /**
     * 根据游戏关卡id获取游戏数据
     *
     * @param id 游戏关卡主键
     * @return 游戏关卡实体
     */
    public ResponseResult<GameSceneData> getGameSceneData(Integer id) {
        try {
            Optional<GameSceneData> optionalGameSceneData = gameSceneDataDao.findById(id);
            if (optionalGameSceneData.isPresent()) {
                return ResponseResult.defSuccessful(optionalGameSceneData.get());
            }
            return ResponseResult.defFailed("该游戏数据可能已被删除！");
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<GameSceneData> delGameSceneData(Integer id) {
        try {
            recordDao.deleteAllByGameSceneDataId(id);
            //找出绑定了游戏的关卡
            List<Game> games = gameDao.findAll().stream().filter(game -> {
                List<GameSceneData> gameSceneDatas = game.getGameSceneDatas();
                for (GameSceneData gameSceneData : gameSceneDatas) {
                    return gameSceneData.getId().equals(id);
                }
                return false;
            }).collect(Collectors.toList());
            for (Game g : games) {
                g.setGameSceneDatas(null);
                gameDao.save(g);
            }
            gameSceneDataDao.deleteById(id);
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    /**
     * 更新数据
     *
     * @param gameSceneData
     * @return
     */
    public ResponseResult<GameSceneData> updateGame(GameSceneData gameSceneData) {
        try {
            GameSceneData result = gameSceneDataDao.save(gameSceneData);
            return ResponseResult.defSuccessful(result);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<List<GameSceneData>> getAllGameSceneData() {
        try {
            List<GameSceneData> all = gameSceneDataDao.findAll();
            return ResponseResult.defSuccessful(all);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Boolean> deleteAllGameSceneData(Integer[] ids) {
        try {
            recordDao.delByIds(ids);
            diffsCoordinateDao.delByIds(ids);
            gameSceneDataDao.delByIds(ids);
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }
}
