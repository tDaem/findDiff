package com.daem.finddiff;

import com.daem.finddiff.controller.GameWebsocketController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class FinddiffApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(FinddiffApplication.class, args);
        GameWebsocketController.setApplicationContext(context);
    }

}
