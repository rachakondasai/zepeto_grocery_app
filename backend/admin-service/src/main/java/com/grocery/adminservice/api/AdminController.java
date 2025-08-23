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
