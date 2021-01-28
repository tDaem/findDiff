package com.daem.finddiff.controller;

import com.daem.finddiff.config.WebSocketEncoder;
import com.daem.finddiff.dto.Message;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.DiffsCoordinate;
import com.daem.finddiff.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/27
 */
@ServerEndpoint(value = "/websocket/{roomNum}/{serialNum}",encoders = WebSocketEncoder.class/*,decoders = WebSocketDecoder.class*/)
@Controller
public class WebsocketController {
    private Logger logger = LoggerFactory.getLogger(WebsocketController.class);
    private static int onlineCount = 0;
    // concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static ConcurrentHashMap<String, Set<Session>> clients = new ConcurrentHashMap<>();
    private static final Map<String, String> userNameList = new ConcurrentHashMap();


    /**
     * 连接建立成功调用的方法
     *
     * @param session 可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     * @throws IOException
     */
    @OnOpen
    public void onOpen(@PathParam("roomNum") int roomNum, @PathParam("serialNum") String serialNum, Session session) throws IOException {

        //将用户加入该房间
        Map<Integer, List<Session>> rooms = RoomService.getRooms();
        rooms.get(roomNum).add(session);

        try {
            logger.info("web socket 连接成功！");
            broadcast(roomNum, Message.TIP("连接成功！"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(@PathParam("roomNum") int roomNum, @PathParam("serialNum") String serialNum, Session session) {
        //获取房间中的所有成员
        List<Session> sessions = RoomService.getRooms().get(roomNum);
        //移除该成员
        sessions.remove(session);
        //销毁房间
        if (sessions.size() == 0){
            logger.info("destroyRoom roomNum=" + roomNum);
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
    public void onMessage(@PathParam("roomNum") int roomNum, @PathParam("serialNum") String serialNum, String message, Session session) throws IOException {
        try {
            //广播坐标
            logger.info("收到客户端的消息：" + message);
            broadcast(roomNum, Message.DATA(message));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据房间进行广播
     *
     * @param roomNum
     * @param message
     */
    private static <T> void broadcast(int roomNum, ResponseResult<Message<T>> message) {
        for (Session session : RoomService.getRooms().get(roomNum)) {
            try {
                session.getBasicRemote().sendObject(message);
            } catch (IOException | EncodeException e) {
                e.printStackTrace();
            }
        }
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
        WebsocketController.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebsocketController.onlineCount--;
    }

}
