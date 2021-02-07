package com.daem.finddiff.dao;

import com.daem.finddiff.entity.GameSceneData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
}
