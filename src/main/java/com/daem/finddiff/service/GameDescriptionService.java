package com.daem.finddiff.service;

import com.daem.finddiff.dao.GameDescriptionDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.GameDescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Description
 * @Author tyx
 * @Date 2021/5/5
 */
@Service
public class GameDescriptionService {

    @Autowired
    private GameDescriptionDao gameDescriptionDao;

    public ResponseResult<GameDescription> saveGameDescription(GameDescription gameDescription) {
        return ResponseResult.defSuccessful(gameDescriptionDao.save(gameDescription));
    }

    public ResponseResult<?> getGameDescription() {
        return ResponseResult.defSuccessful(gameDescriptionDao.getGameDescription());
    }
}
