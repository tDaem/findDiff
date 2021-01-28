package com.daem.finddiff.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @Description websocket信息传输对象
 * @Author tyx
 * @Date 2021/1/28
 */
@Getter
@Setter
@ToString
public class Message<T> {

    private MessageType messageType;

    private T data;

    /**
     * 提示类的消息
     * @param data
     * @return
     */
    public static <T> ResponseResult<Message<T>> TIP(T data){
        Message<T> message = new Message<>();
        message.setMessageType(MessageType.TIP);
        message.setData(data);
        return ResponseResult.defSuccessful(message);
    }

    /**
     * 传输数据
     * @param data
     * @param <T>
     * @return
     */
    public  static <T> ResponseResult<Message<T>> DATA(T data){
        Message<T> message = new Message<>();
        message.setMessageType(MessageType.DATA);
        message.setData(data);
        return ResponseResult.defSuccessful(message);
    }
}
