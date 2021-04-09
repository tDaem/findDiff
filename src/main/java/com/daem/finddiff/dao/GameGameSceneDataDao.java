package com.daem.finddiff.dao;

import com.daem.finddiff.entity.GameGameSceneData;
import com.daem.finddiff.entity.GameGameSceneDataUPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/4/9
 */
public interface GameGameSceneDataDao extends JpaRepository<GameGameSceneData, GameGameSceneDataUPK> {


    @Query("select ggsd from GameGameSceneData ggsd where ggsd.gameGameSceneDataUPK.gameId = :gameId order by ggsd.orderId")
    List<GameGameSceneData> getAllByGameId(Integer gameId);
}
