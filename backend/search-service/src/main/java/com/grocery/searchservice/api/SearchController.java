package com.grocery.searchservice.api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
@RestController @RequestMapping("/search-service")
public class SearchController {
  @Bean @LoadBalanced RestTemplate rt(){ return new RestTemplate(); }
  @Autowired RestTemplate rest;
  @GetMapping("/health") public String health(){ return "ok"; }
  @GetMapping("/products")
  public ResponseEntity<String> search(@RequestParam String q){
    String body = rest.getForObject("http://product-service/product-service/search?q={q}", String.class, q);
    return ResponseEntity.ok(body);
  }
}
