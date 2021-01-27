package com.daem.finddiff.service;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.entity.Serial;
import com.daem.finddiff.dao.SerialDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * @Description 对游戏序列号进行crud服务
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class SerialService {

    @Autowired
    private SerialDao serialDao;

    public ResponseResult<Serial> getSerialBySerial(String serial) {
        Serial serialEntity = null;
        try {
            serialEntity = serialDao.findBySerialNum(serial);
            return ResponseResult.defSuccessful(serialEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Boolean> createSerial(Serial serial) {
        try {
            Serial serial1 = serialDao.save(serial);
            return ResponseResult.defSuccessful(Objects.nonNull(serial1));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Boolean> delSerial(Integer id) {
        try {
            serialDao.deleteById(id);
            return ResponseResult.defSuccessful(true);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Boolean> updateSerial(Serial serial) {
        try {
            Serial serial1 = serialDao.save(serial);
            return ResponseResult.defSuccessful(Objects.nonNull(serial1));
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }
}