package com.daem.finddiff.service;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.DiffsCoordinate;
import org.springframework.stereotype.Service;

import javax.websocket.Session;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

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
    //房间中的坐标数据
    private static final Map<Integer, List<DiffsCoordinate>> roomDatas = new ConcurrentHashMap();

    /**
     * 创建房间号
     *
     * @return
     */
    public ResponseResult<Integer> createRoom() {
        int roomNum;
        do {
            roomNum = new Random().nextInt(899999) + 100000;
        } while (rooms.containsKey(roomNum));
        rooms.put(roomNum, new ArrayList<>());
        roomDatas.put(roomNum, new ArrayList<>());
        return ResponseResult.defSuccessful(roomNum);
    }

    /**
     * 当房间无人时，销毁房间并销毁房间中的数据
     * @param roomNum
     */
    public static void destroyRoom(int roomNum) {
        //销毁房间中的数据
        roomDatas.remove(roomNum);
        //销毁房间
        rooms.remove(roomNum);
    }

    /**
     * 房间中的用户
     * @return
     */
    public static Map<Integer, List<Session>> getRooms() {
        return rooms;
    }

    /**
     * 记录房间中不同点的做标数据
     * @param roomNum
     * @return
     */
    public static List<DiffsCoordinate> getRoomDatas(int roomNum) {
        return roomDatas.get(roomNum);
    }

    /**
     * 查找房间号是否存在
     *
     * @param roomNum 房间号
     * @return
     */
    public ResponseResult<Integer> getRoom(int roomNum) {
        if (rooms.containsKey(roomNum)) {
            return ResponseResult.defSuccessful(roomNum);
        }
        return ResponseResult.defFailed("没有找到该房间！");
    }
}
