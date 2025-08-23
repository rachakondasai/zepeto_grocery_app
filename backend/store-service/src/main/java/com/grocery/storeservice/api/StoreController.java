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
