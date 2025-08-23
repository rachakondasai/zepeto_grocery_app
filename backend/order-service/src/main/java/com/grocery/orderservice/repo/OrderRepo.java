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
