package com.daem.finddiff.service;

import com.daem.finddiff.dao.GameGameSceneDataDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.GameGameSceneData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/4/9
 */
@Service
public class GameGameSceneDataService {

    @Autowired
    private GameGameSceneDataDao gameGameSceneDataDao;


    public ResponseResult<Boolean> saveAll(List<GameGameSceneData> gameGameSceneDatas) {
        try {
            gameGameSceneDataDao.saveAll(gameGameSceneDatas);
            return ResponseResult.defSuccessful(Boolean.TRUE);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("服务器异常！", e.getMessage());
        }
    }
}
