package com.example.backend.services;

import com.example.backend.domain.Stock;
import com.example.backend.domain.User;
import com.example.backend.exceptions.InvalidRequestException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.StockRepository;
import com.example.backend.request.CreateStockRequest;
import com.example.backend.request.UpdateStockRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class StockService {
    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Transactional
    public void insert5Stocks(User user) {
        String[][] stocks = {
                {"AAPL", "Apple Inc."},
                {"GOOGL", "Alphabet Inc."},
                {"MSFT", "Microsoft Corporation"},
                {"AMZN", "Amazon.com Inc."},
                {"TSLA", "Tesla Inc."}
        };
        Double[] prices = {222.52, 200.19, 426.79, 229.43, 412.54};

        List<Stock> stockList = new ArrayList<>();

        for (int i = 0; i < stocks.length; i++) {
            Stock stock = new Stock();
            stock.setSymbol(stocks[i][0]);
            stock.setName(stocks[i][1]);
            stock.setQuantity(1);
            stock.setBuyPrice(BigDecimal.valueOf(prices[i]));
            stock.setUser(user);
            stockList.add(stock);
        }

        stockRepository.saveAll(stockList);
    }

    public List<Stock> getStocksByUser(User user) {
        return stockRepository.findByUser(user);
    }

    public Stock createStock(CreateStockRequest request, User user) {
        if (stockRepository.findBySymbolAndUser(request.symbol(), user).isPresent()) {
            throw new InvalidRequestException("Stock already exists");
        }
        Stock stock = new Stock();
        stock.setSymbol(request.symbol());
        stock.setName(request.name());
        stock.setQuantity(request.quantity());
        stock.setBuyPrice(request.buyPrice());
        stock.setUser(user);
        return stockRepository.save(stock);
    }

    public Stock updateStock(UpdateStockRequest request, User user) {
        Stock stock = stockRepository.findById(request.id())
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));

        stock.setName(request.name());
        stock.setSymbol(request.symbol());
        stock.setQuantity(request.quantity());
        stock.setBuyPrice(request.buyPrice());
        return stockRepository.save(stock);
    }

    public void deleteStock(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));
        stockRepository.delete(stock);
    }
}
