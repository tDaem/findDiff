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
 * @Description 游戏数据,表示一个关卡
 * @Author tyx
 * @Date 2021/1/26
 */
@Entity
@Table
@Getter
@Setter
@ToString
public class GameSceneData {

    /**
     * 主键
     */
    @Id
    @GeneratedValue
    private Integer id;

    /**
     * 该找不同的图片url
     */
    @Column(nullable = false)
    private String imgUrl;

    /**
     * 图片的结构
     * @see Structure
     */
    @Column(nullable = false)
    private Structure structure;

    /**
     * 不同点再图片上的坐标
     */
    @OneToMany(mappedBy = "gameSceneData")
    private List<DiffsCoordinate> diffsCoordinates;

    @ManyToMany(mappedBy = "gameSceneDatas")
    private List<Game> games;

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
