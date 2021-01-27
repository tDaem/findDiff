package com.daem.finddiff.dao;

import com.daem.finddiff.entity.Serial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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

}
