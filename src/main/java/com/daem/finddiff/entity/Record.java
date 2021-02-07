package com.daem.finddiff.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public boolean isStart() {
        return start;
    }

    public void setStart(boolean start) {
        this.start = start;
    }

    public boolean isSkip() {
        return skip;
    }

    public void setSkip(boolean skip) {
        this.skip = skip;
    }

    public int getDiffIndex() {
        return diffIndex;
    }

    public void setDiffIndex(int diffIndex) {
        this.diffIndex = diffIndex;
    }

    public GameSceneData getGameSceneData() {
        return gameSceneData;
    }

    public void setGameSceneData(GameSceneData gameSceneData) {
        this.gameSceneData = gameSceneData;
    }

    public Serial getSerial() {
        return serial;
    }

    public void setSerial(Serial serial) {
        this.serial = serial;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public Integer getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(Integer roomNum) {
        this.roomNum = roomNum;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
