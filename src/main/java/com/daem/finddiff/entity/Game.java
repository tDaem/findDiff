package com.daem.finddiff.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
@EntityListeners(AuditingEntityListener.class)
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public List<GameSceneData> getGameSceneDatas() {
        return gameSceneDatas;
    }

    public void setGameSceneDatas(List<GameSceneData> gameSceneDatas) {
        this.gameSceneDatas = gameSceneDatas;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
