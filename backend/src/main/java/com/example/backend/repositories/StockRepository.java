package com.example.backend.repositories;

import com.example.backend.domain.Stock;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findBySymbolAndUser(String symbol, User user);

    List<Stock> findByUser(User user);
}
