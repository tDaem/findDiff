package com.daem.finddiff.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * @Description 游戏表
 * @Author tyx
 * @Date 2021/1/26
 */
@Entity
@Table
@Getter
@Setter
@ToString
public class Game {

    /**
     * 主键
     */
    @Id
    @GeneratedValue
    private Integer id;

    /**
     * 该游戏叫什么
     */
    private String gameName;

    /**
     * 一个游戏有多个找不同的关卡组成
     */
    @ManyToMany
    private List<GameSceneData> gameSceneDatas;

    /**
     * 该实体创建的时间
     */
    @CreatedDate
    private Date createTime;

    /**
     * 实体更新的时间
     */
    @LastModifiedDate
    private Date updateTime;
}
