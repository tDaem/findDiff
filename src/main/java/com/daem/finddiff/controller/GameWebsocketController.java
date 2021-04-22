package com.daem.finddiff.controller;

import com.alibaba.fastjson.JSONObject;
import com.daem.finddiff.config.WebSocketEncoder;
import com.daem.finddiff.dao.SerialDao;
import com.daem.finddiff.dto.ClickData;
import com.daem.finddiff.dto.Message;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.DiffsCoordinate;
import com.daem.finddiff.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;

/**
 * @Description c处理游戏场景时的联网数据
 * @Author tyx
 * @Date 2021/1/27
 */
@ServerEndpoint(value = "/game/{roomNum}", encoders = WebSocketEncoder.class/*,decoders = WebSocketDecoder.class*/)
@Controller
public class GameWebsocketController {
    private Logger logger = LoggerFactory.getLogger(GameWebsocketController.class);
    private static int onlineCount = 0;

    //此处是解决无法注入的
    private static ApplicationContext applicationContext;

    private SerialDao serialDao;

    public static void setApplicationContext(ApplicationContext applicationContext) {
        GameWebsocketController.applicationContext = applicationContext;
    }

    /**
     * 连接建立成功调用的方法
     *
     * @param session 可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     * @throws IOException
     */
    @OnOpen
    public void onOpen(@PathParam("roomNum") int roomNum, Session session) throws IOException {
        //将用户加入该房间
        Map<Integer, List<Session>> rooms = RoomService.getRooms();
        if (!rooms.get(roomNum).contains(session)) {
            logger.info(session.getRequestParameterMap().get("serialNum") + "进入房间");
            rooms.get(roomNum).add(session);
        }
        boolean mutilPlay = false;
        List<String> mutilPlays = session.getRequestParameterMap().get("mutilPlay");
        if (mutilPlays != null && mutilPlays.size() > 0) {
            mutilPlay = Boolean.parseBoolean(mutilPlays.get(0));
        }
        try {
            //推送房间中的数据
            if (!mutilPlay) {
                broadcast(roomNum, session, true, Message.DATA(RoomService.getClickData(roomNum)));
            } else {//推送房间中的用户
                broadcast(roomNum);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 推送房间中的用户
     *
     * @param roomNum
     */
    private void broadcast(int roomNum) throws Exception {
        List<String> gameNames = new ArrayList<>();
        this.serialDao = applicationContext.getBean(SerialDao.class);
        for (Session session : RoomService.getRooms().get(roomNum)) {
            String gameName = session.getRequestParameterMap().get("gameName").get(0);
            gameNames.add(gameName);
        }
        //将房间里的用户广播出去
        for (Session session : RoomService.getRooms().get(roomNum)) {
            try {
                session.getBasicRemote().sendObject(Message.DATA(gameNames));
            } catch (IOException | EncodeException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(@PathParam("roomNum") int roomNum, Session session) throws Exception {
        logger.info(session.getRequestParameterMap().get("serialNum") + " 退出房间");
        //获取房间中的所有成员
        List<Session> sessions = RoomService.getRooms().get(roomNum);
        //移除该成员
        sessions.remove(session);
        //销毁房间
        broadcast(roomNum);
        if (sessions.size() == 0) {
            logger.info("房间无人，销毁房间 roomNum=" + roomNum);
            RoomService.destroyRoom(roomNum);
        }

        subOnlineCount();
    }


    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     * @param session 可选的参数
     * @throws IOException
     */
    @OnMessage
    public void onMessage(@PathParam("roomNum") int roomNum, String message, Session session) {
        try {
            logger.info("收到客户端的消息：" + message);
            if ("startGame".equals(message)) {//开始游戏
                sendStrMsg(roomNum, Message.DATA(message));
            } else if ("next".equals(message)) {
                //下一关时清空当前关卡的数据
                RoomService.putClickData(roomNum, null);
                sendStrMsg(roomNum, Message.DATA(message));
            } else if ("confirm".equals(message)) {
                //发送确定事件点击的消息
                sendStrMsg(roomNum, Message.DATA(message));
            } else {//广播坐标
                ClickData clickData = JSONObject.parseObject(message, ClickData.class);
                putData(roomNum, clickData);
                broadcast(roomNum, session, Message.DATA(RoomService.getClickData(roomNum)));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据房间号防止房间中的数据
     *
     * @param roomNum
     * @return
     */
    private static void putData(int roomNum, ClickData data) {
        RoomService.putClickData(roomNum, data);
    }

    /**
     * 根据房间进行广播
     *
     * @param roomNum 房间号
     * @param message 向房间中发送消息
     */
    private static <T> void broadcast(int roomNum, Session self, boolean onOpen, ResponseResult<Message<T>> message) {

        for (Session session : RoomService.getRooms().get(roomNum)) {
//            if (!onOpen) continue;
            try {
                session.getBasicRemote().sendObject(message);
            } catch (IOException | EncodeException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 推送开始游戏消息
     *
     * @param roomNum
     * @param message
     * @param <T>
     */
    private static <T> void sendStrMsg(int roomNum, ResponseResult<Message<T>> message) {

        for (Session session : RoomService.getRooms().get(roomNum)) {
            try {
                session.getBasicRemote().sendObject(message);
            } catch (IOException | EncodeException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 非刚进入房间
     *
     * @param roomNum 房间号
     * @param message 向房间中发送消息
     */
    private static <T> void broadcast(int roomNum, Session self, ResponseResult<Message<T>> message) {
        broadcast(roomNum, self, false, message);
    }


    /**
     * 发生错误时调用
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }


    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        GameWebsocketController.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        GameWebsocketController.onlineCount--;
    }

}
