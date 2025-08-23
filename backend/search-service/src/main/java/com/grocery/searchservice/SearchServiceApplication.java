package com.grocery.searchservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class SearchServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SearchServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/search-service")
class BasicController {
    @GetMapping("/health")
    public String health() { return "ok"; }

    @GetMapping("/info")
    public String info() { return "search-service:ready"; }
}
