package com.traveloop.service.impl;

import com.traveloop.model.entity.PackingItem;
import com.traveloop.model.entity.Trip;
import com.traveloop.repository.PackingItemRepository;
import com.traveloop.repository.TripRepository;
import com.traveloop.service.interfaces.PackingItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PackingItemServiceImpl implements PackingItemService {

    private final PackingItemRepository repository;
    private final TripRepository tripRepository;

    @Override
    public List<PackingItem> getItemsByTrip(UUID tripId) {
        return repository.findByTripTripIdOrderByCategoryAscItemNameAsc(tripId);
    }

    @Override
    @Transactional
    public PackingItem addItem(UUID tripId, PackingItem item) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        item.setTrip(trip);
        return repository.save(item);
    }

    @Override
    @Transactional
    public PackingItem togglePacked(UUID itemId) {
        PackingItem item = repository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setIsPacked(!item.getIsPacked());
        return repository.save(item);
    }

    @Override
    @Transactional
    public void deleteItem(UUID itemId) {
        repository.deleteById(itemId);
    }
}
