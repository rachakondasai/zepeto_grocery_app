package com.grocery.storeservice.repo;
import com.grocery.storeservice.model.Store;
import org.springframework.stereotype.Repository;
import java.util.*; import java.util.concurrent.ConcurrentHashMap;
@Repository
public class StoreRepo {
  private final Map<String, Store> store = new ConcurrentHashMap<>();
  public Store save(Store s){ store.put(s.id(), s); return s; }
  public List<Store> all(){ return new ArrayList<>(store.values()); }
}
