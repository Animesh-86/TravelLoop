package com.traveloop.controller;

import com.traveloop.model.entity.PackingItem;
import com.traveloop.service.interfaces.PackingItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips/{tripId}/packing")
@RequiredArgsConstructor
public class PackingItemController {

    private final PackingItemService service;

    @GetMapping
    public ResponseEntity<List<PackingItem>> getPackingItems(@PathVariable UUID tripId) {
        return ResponseEntity.ok(service.getItemsByTrip(tripId));
    }

    @PostMapping
    public ResponseEntity<PackingItem> addPackingItem(@PathVariable UUID tripId, @RequestBody PackingItem item) {
        return ResponseEntity.ok(service.addItem(tripId, item));
    }

    @PatchMapping("/{itemId}/toggle")
    public ResponseEntity<PackingItem> togglePacked(@PathVariable UUID itemId) {
        return ResponseEntity.ok(service.togglePacked(itemId));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deletePackingItem(@PathVariable UUID itemId) {
        service.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
