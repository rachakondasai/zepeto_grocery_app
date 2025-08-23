#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/product-service"
PKG_DIR="$SVC_DIR/src/main/java/com/grocery/productservice"
RES_DIR="$SVC_DIR/src/main/resources"

mkdir -p "$PKG_DIR/model" "$PKG_DIR/api" "$PKG_DIR/repo" "$RES_DIR"

# Ensure POM exists with web + eureka deps
cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.grocery</groupId>
    <artifactId>grocery-backend</artifactId>
    <version>1.0.0</version>
  </parent>
  <artifactId>product-service</artifactId>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
EOF

# application.yml (keep same port 8083)
cat > "$RES_DIR/application.yml" <<'EOF'
server:
  port: 8083

spring:
  application:
    name: product-service

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
EOF

# Model
cat > "$PKG_DIR/model/Product.java" <<'EOF'
package com.grocery.productservice.model;

public record Product(
        String id,
        String name,
        String category,
        String storeId,
        String storeName,
        String unit,
        double price,
        boolean available
) {}
EOF

# Repository (in-memory)
cat > "$PKG_DIR/repo/ProductRepo.java" <<'EOF'
package com.grocery.productservice.repo;

import com.grocery.productservice.model.Product;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class ProductRepo {
    private final Map<String, Product> data = new ConcurrentHashMap<>();

    public ProductRepo() {
        // seed some items
        put(new Product("p1","Tomato","Vegetables","s1","Fresh Mart","kg",40.0,true));
        put(new Product("p2","Potato","Vegetables","s1","Fresh Mart","kg",35.0,true));
        put(new Product("p3","Onion","Vegetables","s2","Veggie World","kg",45.0,true));
        put(new Product("p4","Milk","Dairy","s2","Veggie World","ltr",60.0,true));
        put(new Product("p5","Apple","Fruits","s3","Farm Fresh","kg",180.0,true));
    }

    private void put(Product p){ data.put(p.id(), p); }

    public List<Product> all() { return new ArrayList<>(data.values()); }

    public Optional<Product> byId(String id){ return Optional.ofNullable(data.get(id)); }

    public List<Product> byStore(String storeId){
        return data.values().stream().filter(p -> p.storeId().equalsIgnoreCase(storeId)).collect(Collectors.toList());
    }

    public List<Product> search(String q, String storeId){
        return data.values().stream().filter(p -> {
            boolean name = p.name().toLowerCase().contains(q.toLowerCase());
            boolean cat = p.category().toLowerCase().contains(q.toLowerCase());
            boolean store = (storeId == null || storeId.isBlank()) || p.storeId().equalsIgnoreCase(storeId);
            return (name || cat) && store;
        }).collect(Collectors.toList());
    }
}
EOF

# Controller + DTOs
cat > "$PKG_DIR/api/ProductController.java" <<'EOF'
package com.grocery.productservice.api;

import com.grocery.productservice.model.Product;
import com.grocery.productservice.repo.ProductRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-service")
public class ProductController {

    private final ProductRepo repo;

    public ProductController(ProductRepo repo) {
        this.repo = repo;
    }

    @GetMapping("/health")
    public String health(){ return "ok"; }

    @GetMapping("/products")
    public List<Product> products(){
        return repo.all();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> product(@PathVariable String id){
        return repo.byId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String q, @RequestParam(required = false) String store){
        return repo.search(q, store);
    }

    @GetMapping("/store/{storeId}/products")
    public List<Product> byStore(@PathVariable String storeId){
        return repo.byStore(storeId);
    }
}
EOF

echo "✅ Product Service implemented with in-memory catalog."
