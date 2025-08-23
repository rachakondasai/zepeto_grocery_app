#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/search-service"
PKG="$SVC_DIR/src/main/java/com/grocery/searchservice"
RES="$SVC_DIR/src/main/resources"
mkdir -p "$PKG/api" "$RES"

# add loadbalancer dep
cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>com.grocery</groupId><artifactId>grocery-backend</artifactId><version>1.0.0</version></parent>
  <artifactId>search-service</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>
    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-loadbalancer</artifactId></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
EOF

cat > "$RES/application.yml" <<'EOF'
server: { port: 8087 }
spring: { application: { name: search-service } }
eureka: { client: { service-url: { defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka} }, register-with-eureka: true, fetch-registry: true }, instance: { prefer-ip-address: true } }
EOF

cat > "$PKG/api/SearchController.java" <<'EOF'
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
EOF

echo "✅ Search Service implemented."
