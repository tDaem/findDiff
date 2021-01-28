package com.daem.finddiff.config;

import com.alibaba.fastjson.JSON;
import com.daem.finddiff.dto.Message;
import com.daem.finddiff.dto.ResponseResult;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/28
 */
public class WebSocketEncoder implements Encoder.Text<ResponseResult<Message<?>>> {


    @Override
    public void init(EndpointConfig endpointConfig) {

    }

    @Override
    public void destroy() {

    }

    @Override
    public String encode(ResponseResult<Message<?>> messageResponseResult) throws EncodeException {
        return JSON.toJSONString(messageResponseResult);
    }
}
