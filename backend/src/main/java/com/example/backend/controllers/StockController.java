package com.example.backend.controllers;

import com.example.backend.domain.Stock;
import com.example.backend.domain.User;
import com.example.backend.request.CreateStockRequest;
import com.example.backend.request.UpdateStockRequest;
import com.example.backend.response.CreateStockResponse;
import com.example.backend.response.DeleteStockResponse;
import com.example.backend.response.GetAllStockResponse;
import com.example.backend.services.StockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<GetAllStockResponse> getStocks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return stockService
                .getStocksByUser(user)
                .stream()
                .map(stock -> new GetAllStockResponse(
                        stock.getId(),
                        stock.getName(),
                        stock.getSymbol(),
                        stock.getQuantity(),
                        stock.getBuyPrice()
                )).toList();
    }

    @PostMapping
    public ResponseEntity<CreateStockResponse> createStock(@RequestBody CreateStockRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Stock savedStock = stockService.createStock(request, user);
        return new ResponseEntity<>(
                new CreateStockResponse(
                        "Stock created successfully",
                        savedStock.getId(),
                        savedStock.getName(),
                        savedStock.getSymbol(),
                        savedStock.getQuantity(),
                        savedStock.getBuyPrice()
                ),
                HttpStatus.CREATED
        );
    }

    @PutMapping
    public ResponseEntity<CreateStockResponse> updateStock(@RequestBody UpdateStockRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Stock savedStock = stockService.updateStock(request, user);
        return new ResponseEntity<>(
                new CreateStockResponse(
                        "Stock updated successfully",
                        savedStock.getId(),
                        savedStock.getName(),
                        savedStock.getSymbol(),
                        savedStock.getQuantity(),
                        savedStock.getBuyPrice()
                ),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteStockResponse> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return new ResponseEntity<>(
                new DeleteStockResponse("Stock deleted successfully"),
                HttpStatus.OK
        );
    }
}
