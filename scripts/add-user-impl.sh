#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/user-service"
PKG="$SVC_DIR/src/main/java/com/grocery/userservice"
RES="$SVC_DIR/src/main/resources"
mkdir -p "$PKG/api" "$PKG/model" "$PKG/repo" "$RES"

cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>com.grocery</groupId><artifactId>grocery-backend</artifactId><version>1.0.0</version></parent>
  <artifactId>user-service</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
EOF

cat > "$RES/application.yml" <<'EOF'
server: { port: 8082 }
spring: { application: { name: user-service } }
eureka: { client: { service-url: { defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka} }, register-with-eureka: true, fetch-registry: true }, instance: { prefer-ip-address: true } }
EOF

cat > "$PKG/model/Profile.java" <<'EOF'
package com.grocery.userservice.model;
public record Profile(String email, String name, String phone) {}
EOF

cat > "$PKG/repo/ProfileRepo.java" <<'EOF'
package com.grocery.userservice.repo;
import com.grocery.userservice.model.Profile;
import org.springframework.stereotype.Repository;
import java.util.Map; import java.util.concurrent.ConcurrentHashMap;
@Repository
public class ProfileRepo {
  private final Map<String, Profile> store = new ConcurrentHashMap<>();
  public Profile get(String email){ return store.getOrDefault(email, new Profile(email,"New User","")); }
  public Profile put(Profile p){ store.put(p.email().toLowerCase(), p); return p; }
}
EOF

cat > "$PKG/api/UserController.java" <<'EOF'
package com.grocery.userservice.api;
import com.grocery.userservice.model.Profile;
import com.grocery.userservice.repo.ProfileRepo;
import jakarta.validation.constraints.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/user-service")
public class UserController {
  private final ProfileRepo repo;
  public UserController(ProfileRepo repo){ this.repo = repo; }
  @GetMapping("/health") public String health(){ return "ok"; }
  @GetMapping("/profile")
  public Profile get(@RequestHeader(value="X-User-Email", required=false) String email){
    if (email==null || email.isBlank()) email = "guest@example.com";
    return repo.get(email.toLowerCase());
  }
  @PutMapping("/profile")
  public ResponseEntity<Profile> put(@RequestBody Profile in){
    if (in==null || in.email()==null) return ResponseEntity.badRequest().build();
    return ResponseEntity.ok(repo.put(new Profile(in.email().toLowerCase(), in.name(), in.phone())));
  }
}
EOF

echo "✅ User Service implemented."
