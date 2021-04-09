package com.daem.finddiff.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;


/**
 * @Description
 * @Author tyx
 * @Date 2021/4/6
 */
@Entity
@Table(name = "game_game_scene_datas")
@Data
public class GameGameSceneData implements Serializable{

    @EmbeddedId
    private GameGameSceneDataUPK gameGameSceneDataUPK;
    /**
     * 关卡在此游戏的排序
     */
    private Integer orderId;


}
