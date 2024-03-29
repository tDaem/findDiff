package com.daem.finddiff.service;

import com.daem.finddiff.dao.RecordDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.entity.Serial;
import com.daem.finddiff.dao.SerialDao;
import com.daem.finddiff.entity.SerialStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * @Description 对游戏序列号进行crud服务
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class SerialService {

    @Autowired
    private SerialDao serialDao;

    @Autowired
    private RecordDao recordDao;

    @Transactional
    public ResponseResult<Serial> getSerialBySerial(String serial, String userName) {
        Serial serialEntity = null;
        try {
            serialEntity = serialDao.findBySerialNum(serial);
            if (serialEntity.getSerialStatus() != SerialStatus.NOT_STARTED){//游戏序号已被使用
                return ResponseResult.defSuccessful(serialEntity);
            }
            serialEntity.setUserName(userName);
            Serial save = serialDao.save(serialEntity);
            return ResponseResult.defSuccessful(save);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Serial> createSerial(Serial serial) {
        try {
            Serial bySerialNum = serialDao.findBySerialNum(serial.getSerialNum());
            if (Objects.nonNull(bySerialNum))
                return ResponseResult.defFailed("该序列号已存在！");
            Serial serial1 = serialDao.save(serial);
            return ResponseResult.defSuccessful(serial1);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Boolean> delSerial(Integer id) {
        try {
            recordDao.deleteAllBySerialIds(new Integer[]{id});//删除序列号
            serialDao.updateSetGameIdNullByIds(new Integer[]{id});
            serialDao.deleteById(id);
            return ResponseResult.defSuccessful(true);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Serial> updateSerial(Serial serial) {
        try {
            Serial serial1 = serialDao.save(serial);
            return ResponseResult.defSuccessful(serial1);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<List<Serial>> getSerials() {
        try {
            List<Serial> all = serialDao.findAll(new Sort(Sort.Direction.DESC, "createTime"));
            return ResponseResult.defSuccessful(all);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    public ResponseResult<Serial> getSerial(Integer id) {
        try {
            Optional<Serial> optionalSerial = serialDao.findById(id);
            return optionalSerial.map(ResponseResult::defSuccessful).orElseGet(ResponseResult::defSuccessful);
        } catch (Exception e) {
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Boolean> delSerials(Integer[] ids) {
        try {
            recordDao.deleteAllBySerialIds(ids);//删除序列号
            serialDao.updateSetGameIdNullByIds(ids);//断开与游戏的关联
            serialDao.delAllSerialsByIds(ids);
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Serial> updateSerialBySerialId(String serialNum, SerialStatus serialStatus) {
        try {
            serialDao.updateSerialStatusBySerialNum(serialNum, serialStatus);
//            one.setSerialStatus(serialStatus);
//            serialDao.save(one);
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Boolean> updateSerialsWithGameId(Integer[] ids, Integer gameId) {
        try {
            serialDao.updateSerialsWithGameId(ids, gameId);
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<Void> resetSerials() {
        try {
            recordDao.deleteAll();
            serialDao.resetSerialsState();
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }
}