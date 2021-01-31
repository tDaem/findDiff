package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description 多人游戏房间控制器
 * @Author tyx
 * @Date 2021/1/27
 */
@RestController
public class RoomController {

    @Autowired
    private RoomService roomService;

    //创建房间并返回房间号
    @GetMapping("/room")
    public ResponseResult<Integer> getRoomNum(){
        return roomService.createRoom();
    }

    //创建房间并返回房间号
    @GetMapping("/room/{roomNum}")
    public ResponseResult<Integer> getRoomNum(@PathVariable int roomNum){
        return roomService.getRoom(roomNum);
    }

}
