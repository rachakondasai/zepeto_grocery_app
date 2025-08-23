package com.grocery.productservice.repo;

import com.grocery.productservice.model.Product;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class ProductRepo {
    private final Map<String, Product> data = new ConcurrentHashMap<>();

    public ProductRepo() {
        // seed some items
        put(new Product("p1","Tomato","Vegetables","s1","Fresh Mart","kg",40.0,true));
        put(new Product("p2","Potato","Vegetables","s1","Fresh Mart","kg",35.0,true));
        put(new Product("p3","Onion","Vegetables","s2","Veggie World","kg",45.0,true));
        put(new Product("p4","Milk","Dairy","s2","Veggie World","ltr",60.0,true));
        put(new Product("p5","Apple","Fruits","s3","Farm Fresh","kg",180.0,true));
    }

    private void put(Product p){ data.put(p.id(), p); }

    public List<Product> all() { return new ArrayList<>(data.values()); }

    public Optional<Product> byId(String id){ return Optional.ofNullable(data.get(id)); }

    public List<Product> byStore(String storeId){
        return data.values().stream().filter(p -> p.storeId().equalsIgnoreCase(storeId)).collect(Collectors.toList());
    }

    public List<Product> search(String q, String storeId){
        return data.values().stream().filter(p -> {
            boolean name = p.name().toLowerCase().contains(q.toLowerCase());
            boolean cat = p.category().toLowerCase().contains(q.toLowerCase());
            boolean store = (storeId == null || storeId.isBlank()) || p.storeId().equalsIgnoreCase(storeId);
            return (name || cat) && store;
        }).collect(Collectors.toList());
    }
}
