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
