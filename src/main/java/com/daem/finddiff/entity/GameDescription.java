package com.daem.finddiff.entity;

import lombok.Data;

import javax.persistence.*;

/**
 * @Description 游戏的额外描述
 * @Author tyx
 * @Date 2021/5/5
 */
@Entity
@Table
@Data
public class GameDescription {

    /**
     * 主键
     */
    @Id
    private Integer id;

    /**
     * 登录页的描述
     */
    @Column(name = "login_description", length = 5000)
    private String loginDescription;

    /**
     * 游戏规则页的描述
     */
    @Column(name = "game_rule", length = 5000)
    private String gameRule;

}
