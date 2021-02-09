package com.daem.finddiff.dao;

import com.daem.finddiff.entity.Game;
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
public interface GameDao extends JpaRepository<Game, Integer> {

    @Modifying
    @Query("DELETE FROM Game WHERE id IN :ids")
    void delAllByIds(Integer[] ids);

}
