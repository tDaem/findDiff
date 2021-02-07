package com.daem.finddiff.dao;

import com.daem.finddiff.entity.DiffsCoordinate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/7
 */
@Repository
public interface DiffsCoordinateDao extends JpaRepository<DiffsCoordinate, Integer> {

    @Modifying
    @Query("DELETE FROM DiffsCoordinate df WHERE df.gameSceneData.id IN :ids")
    void delByIds(Integer[] ids);
}
