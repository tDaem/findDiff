package com.daem.finddiff.dao;

import com.daem.finddiff.entity.GameSceneData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/6
 */
@Repository
public interface GameSceneDataDao extends JpaRepository<GameSceneData, Integer> {

    @Modifying
    @Query("DELETE FROM GameSceneData gsd WHERE gsd.id IN :ids")
    void delByIds(Integer[] ids);

    @Query("select gsd from GameSceneData gsd left join GameGameSceneData ggsd on gsd.id = ggsd.gameGameSceneDataUPK.gameSceneDataId where ggsd.gameGameSceneDataUPK.gameId = :gameId order by ggsd.orderId")
    List<GameSceneData> getAllByGameId(Integer gameId);
}
