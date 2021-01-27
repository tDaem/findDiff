package com.daem.finddiff.listener;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Date;
import java.util.Optional;

/**
 * @Description 当实体类新增或更新时 织入操作时间
 * @Author tyx
 * @Date 2021/1/27
 */
@Configuration
public class AuditorAwareImpl implements AuditorAware<Date> {

    @Override
    public Optional<Date> getCurrentAuditor() {
        return Optional.of(new Date());
    }
}
