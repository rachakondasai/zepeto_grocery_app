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
