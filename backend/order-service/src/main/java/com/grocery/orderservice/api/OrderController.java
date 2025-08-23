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
