package com.grocery.productservice.api;

import com.grocery.productservice.model.Product;
import com.grocery.productservice.repo.ProductRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-service")
public class ProductController {

    private final ProductRepo repo;

    public ProductController(ProductRepo repo) {
        this.repo = repo;
    }

    @GetMapping("/health")
    public String health(){ return "ok"; }

    @GetMapping("/products")
    public List<Product> products(){
        return repo.all();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> product(@PathVariable String id){
        return repo.byId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String q, @RequestParam(required = false) String store){
        return repo.search(q, store);
    }

    @GetMapping("/store/{storeId}/products")
    public List<Product> byStore(@PathVariable String storeId){
        return repo.byStore(storeId);
    }
}
