package com.daem.finddiff.dao;

import com.daem.finddiff.entity.GameDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * @Description
 * @Author tyx
 * @Date 2021/5/5
 */
@Repository
public interface GameDescriptionDao extends JpaRepository<GameDescription, Integer> {


    @Query("select gd from GameDescription gd where gd.id = 1")
    GameDescription getGameDescription();

}
