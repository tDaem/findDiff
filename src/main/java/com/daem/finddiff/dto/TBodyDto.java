package com.daem.finddiff.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/9
 */
@Getter
@Setter
@ToString
public class TBodyDto {

    private String roomNum;

    private String GameSceneName;

    private String players;

    private int totalDiffsNum;

    private int hitDiffsNum;

    private List<Long> hitTime;

    private List<String> hitPlayer;

    private boolean skip;

    private Long skipClickNum;

    private long finishTime;

}
