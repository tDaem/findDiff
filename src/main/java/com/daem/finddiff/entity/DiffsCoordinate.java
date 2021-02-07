package com.daem.finddiff.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonBackReference
    private GameSceneData gameSceneData;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public GameSceneData getGameSceneData() {
        return gameSceneData;
    }

    public void setGameSceneData(GameSceneData gameSceneData) {
        this.gameSceneData = gameSceneData;
    }
}
