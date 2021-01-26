package com.daem.finddiff.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

/**
 * @Description 图片不同处的坐标位置
 * @Author tyx
 * @Date 2021/1/26
 */
@Entity
@Table
@Getter
@Setter
@ToString
public class DiffsCoordinate {

    /**
     * 主键
     */
    @Id
    @GeneratedValue
    private Integer id;

    /**
     * x坐标
     */
    @Column(nullable = false)
    private Integer x;

    /**
     * y坐标
     */
    @Column(nullable = false)
    private Integer y;

    @ManyToOne
    private GameSceneData gameSceneData;
}
