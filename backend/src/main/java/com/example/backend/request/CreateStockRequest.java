package com.example.backend.request;

import java.math.BigDecimal;

public record CreateStockRequest(String symbol, String name, Integer quantity, BigDecimal buyPrice) {
}
