package com.daem.finddiff.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/4
 */
@Entity
@Table
@Getter
@Setter
@ToString
@EntityListeners(AuditingEntityListener.class)
public class Record {

    @Id
    @GeneratedValue
    private Integer id;

    /**
     * 是否为开始游戏时记录
     */
    private boolean start;

    /**
     * 是否为跳过游戏时的记录
     */
    private boolean skip;

    /**
     * 第几处不同
     */
    private int diffIndex;

    /**
     * 游戏管卡
     */
    @ManyToOne
    private GameSceneData gameSceneData;

    /**
     * 游戏序列号
     */
    @ManyToOne
    private Serial serial;

    /**
     * 记录数据的时间戳
     */
    private long time;

    /**
     * 这条记录是否命中不同点
     */
    private boolean hit;

    /**
     * 游戏时的房间
     */
    private Integer roomNum;

    /**
     * 该实体创建的时间
     */
    @CreatedDate
    private Date createTime;
}
