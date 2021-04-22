package com.daem.finddiff.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * @Description 点击数据
 * @Author tyx
 * @Date 2021/4/22
 */
@Getter
@Setter
public class ClickData {

    /**
     * 哪个序列号点击的
     */
    private Integer serialId;

    /**
     * 点击的x左边
     */
    private Integer x;

    /**
     * 点击的y坐标
     */
    private Integer y;
}
