package com.daem.finddiff.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * @Description 游戏数据, 表示一个关卡
 * @Author tyx
 * @Date 2021/1/26
 */
@Entity
@Table
@EntityListeners(AuditingEntityListener.class)
public class GameSceneData {

    /**
     * 主键
     */
    @Id
    @GeneratedValue
    private Integer id;

    /**
     * 关卡名
     */
    private String gameSceneName;
    /**
     * 该找不同的图片url
     */
    @Column(nullable = false)
    private String imgPath;

    /**
     * 图片的结构
     *
     * @see Structure
     */
    @Column(nullable = false)
    private Structure structure;

    /**
     * 不同点再图片上的坐标
     */
    @OneToMany(mappedBy = "gameSceneData", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<DiffsCoordinate> diffsCoordinates;

    @ManyToMany(mappedBy = "gameSceneDatas")
    @JsonIgnore
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGameSceneName() {
        return gameSceneName;
    }

    public void setGameSceneName(String gameSceneName) {
        this.gameSceneName = gameSceneName;
    }

    public String getImgPath() {
        return imgPath;
    }

    public void setImgPath(String imgPath) {
        this.imgPath = imgPath;
    }

    public Structure getStructure() {
        return structure;
    }

    public void setStructure(Structure structure) {
        this.structure = structure;
    }

    public List<DiffsCoordinate> getDiffsCoordinates() {
        return diffsCoordinates;
    }

    public void setDiffsCoordinates(List<DiffsCoordinate> diffsCoordinates) {
        this.diffsCoordinates = diffsCoordinates;
    }

    public List<Game> getGames() {
        return games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GameSceneData that = (GameSceneData) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
