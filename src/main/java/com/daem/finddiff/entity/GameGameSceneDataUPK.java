package com.daem.finddiff.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * @Description
 * @Author tyx
 * @Date 2021/4/9
 */
@Data
@Embeddable
public class GameGameSceneDataUPK implements Serializable {
    /**
     * 游戏id
     */
    @Column(name = "games_id")
    private Integer gameId;

    /**
     * 关卡id
     */
    @Column(name = "game_scene_datas_id")
    private Integer gameSceneDataId;
}
