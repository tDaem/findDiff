package com.daem.finddiff.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.util.Date;

/**
 * @Description 登录的用户实体类
 * @Author tyx
 * @Date 2021/1/26
 */
@Entity
@Table
@Getter
@Setter
@ToString
public class GameUser {

    /**
     * 主键 自增
     */
    @Id
    @GeneratedValue
    private Integer id;

    /**
     * 游戏名（游戏id）
     */
    @Column(nullable = false)
    private String gameName;

    /**
     * 该用户玩的游戏对应的序列号id
     */
    @OneToOne(fetch=FetchType.EAGER)
    private Serial serial;

}
