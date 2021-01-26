package com.daem.finddiff.dao;

import com.daem.finddiff.entity.GameUser;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/26
 */
public interface UserDao extends JpaRepository<GameUser, Integer> {
}
