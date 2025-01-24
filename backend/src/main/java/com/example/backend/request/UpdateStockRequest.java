package com.example.backend.request;

import java.math.BigDecimal;

public record UpdateStockRequest(Long id, String symbol, String name, Integer quantity, BigDecimal buyPrice) {
}
