package com.daem.finddiff.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
 * @Description 序列号实体类
 * @Author tyx
 * @Date 2021/1/26
 */
@Entity
@Table
@EntityListeners(AuditingEntityListener.class)
public class Serial {

    /**
     * 序列号id
     */
    @Id
    @GeneratedValue
    private Integer id;

    /**
     * 序列号
     */
    @Column(nullable = false, unique = true)
    private String serialNum;

    /**
     * 此序列号游戏中的状态(默认为未开始)
     *
     * @see SerialStatus
     */
    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private SerialStatus serialStatus = SerialStatus.NOT_STARTED;

    /**
     * 多个序列号玩同一个游戏
     */
    @ManyToOne(fetch = FetchType.EAGER)
    private Game game;

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

    public String getSerialNum() {
        return serialNum;
    }

    public void setSerialNum(String serialNum) {
        this.serialNum = serialNum;
    }

    public SerialStatus getSerialStatus() {
        return serialStatus;
    }

    public void setSerialStatus(SerialStatus serialStatus) {
        this.serialStatus = serialStatus;
    }


    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
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
