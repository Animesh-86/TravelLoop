package com.traveloop.repository;

import com.traveloop.model.entity.CommunityMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommunityMessageRepository extends JpaRepository<CommunityMessage, UUID> {
    
    @Query("SELECT m FROM CommunityMessage m JOIN FETCH m.user ORDER BY m.createdAt DESC")
    List<CommunityMessage> findLatestMessages();
}
