package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.Game;
import com.daem.finddiff.entity.Serial;
import com.daem.finddiff.entity.SerialStatus;
import com.daem.finddiff.service.SerialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Description 序列号控制器
 * @Author tyx
 * @Date 2021/1/26
 */
@RestController
public class SerialController {

    @Autowired
    private SerialService serialService;

    @GetMapping("/serial")
    public ResponseResult<Serial> getSerialBySerial(String serialNum, String userName){
        return serialService.getSerialBySerial(serialNum, userName);
    }

    @GetMapping("/serial/{id}")
    public ResponseResult<Serial> getSerial(@PathVariable Integer id){
        return serialService.getSerial(id);
    }

    @GetMapping("/serials")
    public ResponseResult<List<Serial>> getSerials(){
        return serialService.getSerials();
    }

    /**
     * 新建一个序列号
     * @param serialNum
     * @return
     */
    @PostMapping(value = "/serial", produces = "application/json;charset=UTF-8")
    public ResponseResult<Serial> createSerial(@RequestBody Serial serialNum){
        return serialService.createSerial(serialNum);
    }

    /**
     * 删除序列号实例
     *
     * @param id 序列号id
     * @return 如果删除成功，泛型中返回true，否则false
     */
    @DeleteMapping(value = "/serial/{id}")
    public ResponseResult<Boolean> delSerial(@PathVariable Integer id) {
        return serialService.delSerial(id);
    }

    @DeleteMapping(value = "/serials")
    public ResponseResult<Boolean> delSerials(@RequestBody Integer[] ids) {
        return serialService.delSerials(ids);
    }

    /**
     * 更新序列号实例
     *
     * @param serial 需要更新的序列号实例
     * @return 如果删除成功，泛型中返回true，否则false
     */
    @PutMapping(value = "/serial", produces = "application/json;charset=UTF-8")
    public ResponseResult<Serial> updateSerial(@RequestBody Serial serial) {
        return serialService.updateSerial(serial);
    }

    @PutMapping(value = "/serials", produces = "application/json;charset=UTF-8")
    public ResponseResult<Boolean> updateSerialsWithGameId(@RequestParam("serialIds[]") Integer[] ids, Integer gameId) {
        return serialService.updateSerialsWithGameId(ids,gameId);
    }

    @PutMapping(value = "/updateStatus")
    public ResponseResult<Serial> updateSerialStatus(Integer serialId, SerialStatus serialStatus) {
        return serialService.updateSerialBySerialId(serialId, serialStatus);
    }
}
