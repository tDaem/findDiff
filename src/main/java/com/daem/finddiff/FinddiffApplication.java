package com.daem.finddiff;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class FinddiffApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinddiffApplication.class, args);
    }

}
