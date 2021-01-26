package com.daem.finddiff.service;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Serial;
import com.daem.finddiff.dao.SerialDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Description 对游戏序列号进行crud服务
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class SerialService {

    @Autowired
    private SerialDao serialMapper;

    public ResponseResult<Serial> getSerialBySerial(String serial) {
        Serial serialEntity = null;
        try {
            serialEntity = serialMapper.findBySerial(serial);
            return ResponseResult.defSuccessful(serialEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

}
