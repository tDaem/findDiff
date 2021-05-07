package com.daem.finddiff.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
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
@Data
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
    @JoinTable(name = "game_game_scene_datas",
            //当前对象在中间表的外键
            joinColumns = {@JoinColumn(name = "games_id", referencedColumnName = "id")},
            //对方对象在中间表的外键
            inverseJoinColumns = {@JoinColumn(name = "game_scene_datas_id", referencedColumnName = "id")}
    )
    private List<GameSceneData> gameSceneDatas;

    /**
     * 是否为试玩游戏
     */
    private boolean test;

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
