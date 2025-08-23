#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
SVC_DIR="$ROOT/backend/auth-service"
PKG_DIR="$SVC_DIR/src/main/java/com/grocery/authservice"
RES_DIR="$SVC_DIR/src/main/resources"

mkdir -p "$PKG_DIR/security" "$PKG_DIR/api" "$PKG_DIR/user" "$RES_DIR"

cat > "$SVC_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.grocery</groupId>
    <artifactId>grocery-backend</artifactId>
    <version>1.0.0</version>
  </parent>
  <artifactId>auth-service</artifactId>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-api</artifactId>
      <version>0.11.5</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-impl</artifactId>
      <version>0.11.5</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-jackson</artifactId>
      <version>0.11.5</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
EOF

cat > "$RES_DIR/application.yml" <<'EOF'
server:
  port: 8081

spring:
  application:
    name: auth-service

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true

jwt:
  secret: ${JWT_SECRET:this_is_dev_only_change_me}
  expirationMs: ${JWT_EXPIRATION_MS:86400000}

management:
  endpoints.web.exposure.include: health,info
EOF

cat > "$PKG_DIR/AuthServiceApplication.java" <<'EOF'
package com.grocery.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}

@RestController
class HealthController {
    @GetMapping("/auth/health")
    public String health() { return "ok"; }
}
EOF

cat > "$PKG_DIR/security/JwtService.java" <<'EOF'
package com.grocery.authservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    private final Key key;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expirationMs}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generate(String username, String role) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(username)
                .addClaims(Map.of("role", role))
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}
EOF

cat > "$PKG_DIR/security/SecurityConfig.java" <<'EOF'
package com.grocery.authservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtService jwt) throws Exception {
        http
          .csrf(csrf -> csrf.disable())
          .cors(Customizer.withDefaults())
          .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/health", "/auth/signup", "/auth/login").permitAll()
                .anyRequest().authenticated()
          )
          .addFilterBefore(new TokenFilter(jwt), BasicAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    static class TokenFilter extends BasicAuthenticationFilter {
        private final JwtService jwt;
        public TokenFilter(JwtService jwt) { super(authentication -> authentication); this.jwt = jwt; }

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain chain) throws IOException, ServletException {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                try {
                    var claims = jwt.parse(token).getBody();
                    String username = claims.getSubject();
                    String role = (String) claims.get("role");
                    UserDetails principal = User.withUsername(username).password("").roles(role).build();
                    var auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } catch (Exception ignored) { }
            }
            chain.doFilter(request, response);
        }
    }
}
EOF

cat > "$PKG_DIR/user/User.java" <<'EOF'
package com.grocery.authservice.user;

public record User(String username, String passwordHash, String role) {}
EOF

cat > "$PKG_DIR/user/UserStore.java" <<'EOF'
package com.grocery.authservice.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class UserStore {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final PasswordEncoder encoder;

    public UserStore(PasswordEncoder encoder) {
        this.encoder = encoder;
        create("admin@grocery.app", "Admin@123", "ADMIN");
    }

    public User create(String username, String rawPassword, String role) {
        String hash = encoder.encode(rawPassword);
        User u = new User(username.toLowerCase(), hash, role);
        users.put(u.username(), u);
        return u;
    }

    public User find(String username) {
        return users.get(username.toLowerCase());
    }

    public boolean verify(String username, String rawPassword) {
        User u = find(username);
        return u != null && encoder.matches(rawPassword, u.passwordHash());
    }
}
EOF

cat > "$PKG_DIR/api/AuthDtos.java" <<'EOF'
package com.grocery.authservice.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public record SignupReq(@Email String email, @NotBlank String password) {}
    public record LoginReq(@Email String email, @NotBlank String password) {}
    public record TokenRes(String accessToken, String tokenType) { public TokenRes(String t){this(t,"Bearer");} }
    public record MeRes(String email, String role) {}
}
EOF

cat > "$PKG_DIR/api/AuthController.java" <<'EOF'
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
EOF

"$PWD/$(dirname "$0")/update-gateway-routes.sh" "$ROOT" || true

echo "Auth service written (macOS-safe)."
