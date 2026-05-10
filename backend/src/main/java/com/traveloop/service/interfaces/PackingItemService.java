package com.traveloop.service.interfaces;

import com.traveloop.model.entity.PackingItem;
import java.util.List;
import java.util.UUID;

public interface PackingItemService {
    List<PackingItem> getItemsByTrip(UUID tripId);
    PackingItem addItem(UUID tripId, PackingItem item);
    PackingItem togglePacked(UUID itemId);
    void deleteItem(UUID itemId);
}
