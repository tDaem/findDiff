package com.daem.finddiff.dao;

import com.daem.finddiff.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/4
 */
@Repository
public interface RecordDao extends JpaRepository<Record, Integer> {
}
