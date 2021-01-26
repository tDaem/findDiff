package com.daem.finddiff.entity;

/**
 * @Description 此序列号的状态
 * @Author tyx
 * @Date 2021/1/26
 */
public enum SerialStatus {

    /**
     * 此序列号未使用过
     */
    NOT_STARTED,
    /**
     * 此序列号的游戏正再游戏中（中途退出后可继续当前关卡）
     */
    IN_PROGRESS,
    /**
     * 此序列号游戏已经完成
     */
    COMPLETED
}
