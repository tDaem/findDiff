package com.daem.finddiff.service;

import com.daem.finddiff.dto.ResponseResult;
import org.springframework.stereotype.Service;

import javax.websocket.Session;
import java.util.*;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/27
 */
@Service
public class RoomService {

    /**
     * 用来存储已创建的房间
     */
    private static final Map<Integer, List<Session>> rooms = new HashMap<>();

    /**
     * 创建房间号
     * @return
     */
    public ResponseResult<Integer> createRoom() {
        int roomNum;
        do {
            roomNum = new Random().nextInt(999999);
        } while (rooms.containsKey(roomNum));
        rooms.put(roomNum, new ArrayList<>());
        return ResponseResult.defSuccessful(roomNum);
    }

    public static void destroyRoom(int roomNum){
        rooms.remove(roomNum);
    }

    public static Map<Integer, List<Session>> getRooms() {
        return rooms;
    }
}
