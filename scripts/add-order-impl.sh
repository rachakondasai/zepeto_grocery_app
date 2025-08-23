#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/order-service"
PKG="$SVC_DIR/src/main/java/com/grocery/orderservice"
RES="$SVC_DIR/src/main/resources"
mkdir -p "$PKG/api" "$PKG/model" "$PKG/repo" "$RES"

cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>com.grocery</groupId><artifactId>grocery-backend</artifactId><version>1.0.0</version></parent>
  <artifactId>order-service</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>
    <dependency><groupId>com.fasterxml.jackson.core</groupId><artifactId>jackson-databind</artifactId></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
EOF

cat > "$RES/application.yml" <<'EOF'
server: { port: 8085 }
spring: { application: { name: order-service } }
eureka: { client: { service-url: { defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka} }, register-with-eureka: true, fetch-registry: true }, instance: { prefer-ip-address: true } }
EOF

cat > "$PKG/model/OrderItem.java" <<'EOF'
package com.grocery.orderservice.model;
public record OrderItem(String productId, String name, double unitPrice, int qty){}
EOF

cat > "$PKG/model/Order.java" <<'EOF'
package com.grocery.orderservice.model;
import java.time.Instant; import java.util.List;
public record Order(String id, String email, List<OrderItem> items, double total, Instant createdAt) {}
EOF

cat > "$PKG/repo/OrderRepo.java" <<'EOF'
package com.grocery.orderservice.repo;
import com.grocery.orderservice.model.Order;
import org.springframework.stereotype.Repository;
import java.util.*; import java.util.concurrent.ConcurrentHashMap; import java.util.stream.Collectors;
@Repository
public class OrderRepo {
  private final Map<String, List<Order>> data = new ConcurrentHashMap<>();
  public Order save(Order o){ data.computeIfAbsent(o.email(), k-> new ArrayList<>()).add(o); return o; }
  public List<Order> history(String email){ return data.getOrDefault(email, List.of()); }
}
EOF

cat > "$PKG/api/OrderController.java" <<'EOF'
package com.grocery.orderservice.api;
import com.grocery.orderservice.model.Order;
import com.grocery.orderservice.model.OrderItem;
import com.grocery.orderservice.repo.OrderRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant; import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/order-service")
public class OrderController {
  private final OrderRepo repo;
  public OrderController(OrderRepo repo){ this.repo = repo; }
  @GetMapping("/health") public String health(){ return "ok"; }
  record CreateReq(List<OrderItem> items) {}
  @PostMapping("/create")
  public ResponseEntity<Order> create(@RequestHeader("X-User-Email") String email, @RequestBody CreateReq req){
    if (req == null || req.items()==null || req.items().isEmpty()) return ResponseEntity.badRequest().build();
    double total = req.items().stream().mapToDouble(i -> i.unitPrice()*i.qty()).sum();
    Order o = new Order(UUID.randomUUID().toString(), email.toLowerCase(), req.items(), total, Instant.now());
    return ResponseEntity.ok(repo.save(o));
  }
  @GetMapping("/history")
  public List<Order> history(@RequestHeader("X-User-Email") String email){ return repo.history(email.toLowerCase()); }
}
EOF

echo "✅ Order Service implemented."
