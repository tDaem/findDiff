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
    //房间中点击的坐标
    private static final Map<Integer, DiffsCoordinate> diffsCoordinateMap = new HashMap<>();

    /**
     * 创建房间号
     *
     * @return
     */
    public ResponseResult<Integer> createRoom(Integer gameId) {
        int roomNum;
        do {
            roomNum = new Random().nextInt(899999) + 100000;
        } while (rooms.containsKey(roomNum));
        rooms.put(roomNum, new ArrayList<>());
        diffsCoordinateMap.put(roomNum, null);
        return ResponseResult.defSuccessful(roomNum);
    }

    /**
     * 当房间无人时，销毁房间并销毁房间中的数据
     * @param roomNum
     */
    public static void destroyRoom(int roomNum) {
        //销毁房间中的数据
        diffsCoordinateMap.remove(roomNum);
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
     * 获取点击的坐标
     * @param roomNum
     * @return
     */
    public static DiffsCoordinate getDiffsCoordinate(int roomNum) {
        return diffsCoordinateMap.get(roomNum);
    }

    public static void putDiffsCoordinate(int roomNum, DiffsCoordinate diffsCoordinate) {
        diffsCoordinateMap.put(roomNum, diffsCoordinate);
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
