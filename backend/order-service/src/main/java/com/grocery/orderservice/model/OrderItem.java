package com.grocery.orderservice.model;
public record OrderItem(String productId, String name, double unitPrice, int qty){}
