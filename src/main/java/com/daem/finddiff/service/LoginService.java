package com.daem.finddiff.service;

import com.daem.finddiff.dao.SerialDao;
import com.daem.finddiff.dao.UserDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Serial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * @Description 登陆服务（）
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class LoginService {

    @Autowired
    private SerialDao serialDao;

    @Autowired
    private UserDao userDao;

    public ResponseResult<Boolean> login(String gameId, String serialNum) {
        Serial serialEntity = null;
        try {
            serialEntity = serialDao.findBySerialNum(serialNum);
            if (Objects.isNull(serialEntity)){
                return ResponseResult.defFailed("游戏序列号不存在！");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
