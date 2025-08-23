package com.grocery.authservice.api;

import com.grocery.authservice.security.JwtService;
import com.grocery.authservice.user.User;
import com.grocery.authservice.user.UserStore;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import static com.grocery.authservice.api.AuthDtos.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserStore store;
    private final JwtService jwt;

    public AuthController(UserStore store, JwtService jwt) {
        this.store = store; this.jwt = jwt;
    }

    @GetMapping("/health")
    public String health() { return "ok"; }

    @PostMapping("/signup")
    public ResponseEntity<TokenRes> signup(@RequestBody @Valid SignupReq req) {
        if (store.find(req.email()) != null) return ResponseEntity.status(409).build();
        User u = store.create(req.email(), req.password(), "USER");
        String token = jwt.generate(u.username(), u.role());
        return ResponseEntity.ok(new TokenRes(token));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenRes> login(@RequestBody @Valid LoginReq req) {
        if (!store.verify(req.email(), req.password())) return ResponseEntity.status(401).build();
        User u = store.find(req.email());
        String token = jwt.generate(u.username(), u.role());
        return ResponseEntity.ok(new TokenRes(token));
    }

    @GetMapping("/me")
    public ResponseEntity<MeRes> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String email = auth.getName();
        var u = store.find(email);
        return ResponseEntity.ok(new MeRes(email, u != null ? u.role() : "USER"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
