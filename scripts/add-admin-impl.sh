#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/admin-service"
PKG="$SVC_DIR/src/main/java/com/grocery/adminservice"
RES="$SVC_DIR/src/main/resources"
mkdir -p "$PKG/api" "$PKG/model" "$PKG/repo" "$RES"

cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>com.grocery</groupId><artifactId>grocery-backend</artifactId><version>1.0.0</version></parent>
  <artifactId>admin-service</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
EOF

cat > "$RES/application.yml" <<'EOF'
server: { port: 8086 }
spring: { application: { name: admin-service } }
eureka: { client: { service-url: { defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka} }, register-with-eureka: true, fetch-registry: true }, instance: { prefer-ip-address: true } }
EOF

cat > "$PKG/model/Store.java" <<'EOF'
package com.grocery.adminservice.model;
public record Store(String id, String name, String ownerEmail) {}
EOF

cat > "$PKG/repo/AdminRepo.java" <<'EOF'
package com.grocery.adminservice.repo;
import com.grocery.adminservice.model.Store;
import org.springframework.stereotype.Repository;
import java.util.*; import java.util.concurrent.ConcurrentHashMap;
@Repository
public class AdminRepo {
  private final Map<String, Store> stores = new ConcurrentHashMap<>();
  public Store register(Store s){ stores.put(s.id(), s); return s; }
  public List<Store> all(){ return new ArrayList<>(stores.values()); }
}
EOF

cat > "$PKG/api/AdminController.java" <<'EOF'
package com.grocery.adminservice.api;
import com.grocery.adminservice.model.Store;
import com.grocery.adminservice.repo.AdminRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/admin-service")
public class AdminController {
  private final AdminRepo repo;
  public AdminController(AdminRepo repo){ this.repo = repo; }
  @GetMapping("/health") public String health(){ return "ok"; }
  record RegisterReq(String name, String ownerEmail){}
  @PostMapping("/register-store")
  public Store register(@RequestBody RegisterReq req){
    return repo.register(new Store(UUID.randomUUID().toString(), req.name(), req.ownerEmail()));
  }
  @GetMapping("/stores")
  public List<Store> stores(){ return repo.all(); }
  @GetMapping("/download/{orderId}")
  public ResponseEntity<String> download(@PathVariable String orderId){
    return ResponseEntity.ok("packing_list_for_"+orderId+".csv");
  }
}
EOF

echo "✅ Admin Service implemented."
