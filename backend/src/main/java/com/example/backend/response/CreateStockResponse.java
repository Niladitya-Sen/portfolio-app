package com.example.backend.response;

import java.math.BigDecimal;

public record CreateStockResponse(String message, Long id, String name, String symbol, Integer quantity,
                                  BigDecimal buyPrice) {
}
