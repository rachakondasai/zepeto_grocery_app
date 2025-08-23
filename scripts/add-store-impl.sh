#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/store-service"
PKG="$SVC_DIR/src/main/java/com/grocery/storeservice"
RES="$SVC_DIR/src/main/resources"
mkdir -p "$PKG/api" "$PKG/model" "$PKG/repo" "$RES"

cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>com.grocery</groupId><artifactId>grocery-backend</artifactId><version>1.0.0</version></parent>
  <artifactId>store-service</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
EOF

cat > "$RES/application.yml" <<'EOF'
server: { port: 8088 }
spring: { application: { name: store-service } }
eureka: { client: { service-url: { defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka} }, register-with-eureka: true, fetch-registry: true }, instance: { prefer-ip-address: true } }
EOF

cat > "$PKG/model/Store.java" <<'EOF'
package com.grocery.storeservice.model;
public record Store(String id, String name) {}
EOF

cat > "$PKG/repo/StoreRepo.java" <<'EOF'
package com.grocery.storeservice.repo;
import com.grocery.storeservice.model.Store;
import org.springframework.stereotype.Repository;
import java.util.*; import java.util.concurrent.ConcurrentHashMap;
@Repository
public class StoreRepo {
  private final Map<String, Store> store = new ConcurrentHashMap<>();
  public Store save(Store s){ store.put(s.id(), s); return s; }
  public List<Store> all(){ return new ArrayList<>(store.values()); }
}
EOF

cat > "$PKG/api/StoreController.java" <<'EOF'
package com.grocery.storeservice.api;
import com.grocery.storeservice.model.Store;
import com.grocery.storeservice.repo.StoreRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/store-service")
public class StoreController {
  private final StoreRepo repo;
  public StoreController(StoreRepo repo){ this.repo = repo; }
  @GetMapping("/health") public String health(){ return "ok"; }
  @PostMapping("/") public Store create(@RequestParam String name){ return repo.save(new Store(java.util.UUID.randomUUID().toString(), name)); }
  @GetMapping("/") public List<Store> all(){ return repo.all(); }
}
EOF

echo "✅ Store Service implemented."
