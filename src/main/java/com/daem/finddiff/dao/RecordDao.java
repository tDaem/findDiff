package com.daem.finddiff.dao;

import com.daem.finddiff.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/4
 */
@Repository
public interface RecordDao extends JpaRepository<Record, Integer> {

    @Modifying
    @Query("DELETE FROM Record r WHERE r.gameSceneData.id = :gameSceneDataId")
    void deleteAllByGameSceneDataId(Integer gameSceneDataId);

    @Modifying
    @Query("DELETE FROM Record r WHERE r.gameSceneData.id IN :ids")
    void delByIds(Integer[] ids);

    @Query("select r from Record r where r.serial.game.id = :gameId order by r.time")
    List<Record> findAllByGameId(Integer gameId);

    @Modifying
    @Query("DELETE FROM Record r WHERE r.serial.id IN :ids")
    void deleteAllBySerialIds(Integer[] ids);

    void deleteAllBySerial_Game_Id(Integer gameId);

    List<Record> findAllByRoomNumOrderByTime(Integer roomNum);
}
