package com.example.backend.response;

import java.math.BigDecimal;

public record GetAllStockResponse(Long id, String name, String symbol, Integer quantity, BigDecimal price) {
}
