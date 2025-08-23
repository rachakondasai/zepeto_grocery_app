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
