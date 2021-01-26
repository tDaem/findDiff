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
 * @Description 序列号实体类
 * @Author tyx
 * @Date 2021/1/26
 */
@Entity
@Table
@Getter
@Setter
@ToString
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
    private String serial;

    @OneToMany(mappedBy = "serial")
    private List<GameUser> gameUsers;

    /**
     * 序列号的类型
     * @see SerialType
     */
    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private SerialType serialType;

    /**
     * 此序列号游戏中的状态
     * @see SerialStatus
     */
    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private SerialStatus serialStatus;

    /**
     * 多个序列号玩同一个游戏
     */
    @ManyToOne
    private Game Game;

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
