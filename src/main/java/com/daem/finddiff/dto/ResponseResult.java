package com.matrix.auth.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @Description 接口返回数据对象
 * @Author tyx
 * @Date 2020/12/25
 */
@Getter
@Setter
@ToString
public class ResponseResult<T> {

    /**
     * 返回的码
     */
    private int code;

    /**
     * 返回的额外信息
     */
    private String msg;

    /**
     * http状态码
     */
    private int status;

    /**
     * 返回的数据
     */
    private T data;


    /**
     * 返回数据成功
     */
    private static final int SUCCESSFUL = 0;

    /**
     * 返回数据失败
     */
    private static final int FAILED = 1;

    /**
     * 成功但没有数据
     */
    public static <T> ResponseResult<T> defSuccessful() {
        return defSuccessful(null);
    }

    /**
     * 成功且但返回数据
     */
    public static <T> ResponseResult<T> defSuccessful(T data) {
        ResponseResult<T> result = new ResponseResult<>();
        result.code = SUCCESSFUL;
        result.data = data;
        return result;
    }

    /**
     * 失败但没有额外信息
     */
    public static <T> ResponseResult<T> defFailed() {
        return defFailed(null);
    }

    /**
     * 失败且携带额外信息
     */
    public static <T> ResponseResult<T> defFailed(String msg) {
        ResponseResult<T> result = new ResponseResult<>();
        result.code = FAILED;
        result.msg = msg;
        return result;
    }
}