#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/cart-service"
PKG="$SVC_DIR/src/main/java/com/grocery/cartservice"
RES="$SVC_DIR/src/main/resources"
mkdir -p "$PKG/api" "$PKG/model" "$PKG/repo" "$RES"

cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>com.grocery</groupId><artifactId>grocery-backend</artifactId><version>1.0.0</version></parent>
  <artifactId>cart-service</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
EOF

cat > "$RES/application.yml" <<'EOF'
server: { port: 8084 }
spring: { application: { name: cart-service } }
eureka: { client: { service-url: { defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka} }, register-with-eureka: true, fetch-registry: true }, instance: { prefer-ip-address: true } }
EOF

cat > "$PKG/model/CartItem.java" <<'EOF'
package com.grocery.cartservice.model;
public record CartItem(String productId, String name, double unitPrice, int qty){}
EOF

cat > "$PKG/repo/CartRepo.java" <<'EOF'
package com.grocery.cartservice.repo;
import com.grocery.cartservice.model.CartItem;
import org.springframework.stereotype.Repository;
import java.util.*; import java.util.concurrent.ConcurrentHashMap;
@Repository
public class CartRepo {
  private final Map<String, Map<String, CartItem>> carts = new ConcurrentHashMap<>();
  private Map<String, CartItem> user(String email){ return carts.computeIfAbsent(email, k-> new ConcurrentHashMap<>()); }
  public List<CartItem> items(String email){ return new ArrayList<>(user(email).values()); }
  public List<CartItem> add(String email, CartItem i){ user(email).put(i.productId(), i); return items(email); }
  public List<CartItem> remove(String email, String productId){ user(email).remove(productId); return items(email); }
  public void clear(String email){ user(email).clear(); }
}
EOF

cat > "$PKG/api/CartController.java" <<'EOF'
package com.grocery.cartservice.api;
import com.grocery.cartservice.model.CartItem;
import com.grocery.cartservice.repo.CartRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/cart-service")
public class CartController {
  private final CartRepo repo;
  public CartController(CartRepo repo){ this.repo = repo; }
  @GetMapping("/health") public String health(){ return "ok"; }
  @GetMapping("/items")
  public List<CartItem> items(@RequestHeader("X-User-Email") String email){ return repo.items(email.toLowerCase()); }
  @PostMapping("/add")
  public List<CartItem> add(@RequestHeader("X-User-Email") String email, @RequestBody CartItem item){ return repo.add(email.toLowerCase(), item); }
  @DeleteMapping("/remove/{productId}")
  public List<CartItem> remove(@RequestHeader("X-User-Email") String email, @PathVariable String productId){ return repo.remove(email.toLowerCase(), productId); }
  @DeleteMapping("/clear")
  public ResponseEntity<Void> clear(@RequestHeader("X-User-Email") String email){ repo.clear(email.toLowerCase()); return ResponseEntity.noContent().build(); }
}
EOF

echo "✅ Cart Service implemented."
