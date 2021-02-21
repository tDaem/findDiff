package com.daem.finddiff.dao;

import com.daem.finddiff.entity.Serial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/26
 */
@Repository
public interface SerialDao extends JpaRepository<Serial, Integer> {

    /**
     * 通过序列号找序列号实体类
     * @param serial 序列号字符串
     * @return 序列号实体类
     */
    Serial findBySerialNum(String serial) throws Exception;

    @Modifying
    @Query("update Serial set game.id = null where game.id in :ids")
    void updateByIds(Integer[] ids);

    @Modifying
    @Query("delete from Serial where id in :ids")
    void delAllSerialsByIds(Integer[] ids);

    List<Serial> findAllByGame_Id(Integer gameId);

    @Modifying
    @Query("update Serial s set s.game.id = :gameId where s.id in :ids")
    void updateSerialsWithGameId(Integer[] ids, Integer gameId);

    @Modifying
    @Query("update Serial s set s.game.id = null where s.id in :ids")
    void updateSetGameIdNullByIds(Integer[] ids);

    @Modifying
    @Query("update Serial s set s.serialStatus = 0")
    void resetSerialsState();
}
