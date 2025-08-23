package com.grocery.adminservice.repo;
import com.grocery.adminservice.model.Store;
import org.springframework.stereotype.Repository;
import java.util.*; import java.util.concurrent.ConcurrentHashMap;
@Repository
public class AdminRepo {
  private final Map<String, Store> stores = new ConcurrentHashMap<>();
  public Store register(Store s){ stores.put(s.id(), s); return s; }
  public List<Store> all(){ return new ArrayList<>(stores.values()); }
}
