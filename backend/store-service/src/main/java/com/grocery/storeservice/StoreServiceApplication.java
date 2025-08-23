package com.grocery.storeservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class StoreServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(StoreServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/store-service")
class BasicController {
    @GetMapping("/health")
    public String health() { return "ok"; }

    @GetMapping("/info")
    public String info() { return "store-service:ready"; }
}
