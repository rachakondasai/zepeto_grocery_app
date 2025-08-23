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
