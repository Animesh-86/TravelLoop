package com.traveloop.service.impl;

import com.traveloop.exception.DuplicateResourceException;
import com.traveloop.exception.ResourceNotFoundException;
import com.traveloop.model.dto.request.TripRequest;
import com.traveloop.model.dto.request.TripStopRequest;
import com.traveloop.model.dto.response.*;
import com.traveloop.model.entity.*;
import com.traveloop.repository.*;
import com.traveloop.service.interfaces.TripService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TripServiceImpl implements TripService {

    private static final Logger log = LoggerFactory.getLogger(TripServiceImpl.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final TripStopRepository tripStopRepository;
    private final TripCollaboratorRepository collaboratorRepository;
    private final ModelMapper modelMapper;

    public TripServiceImpl(TripRepository tripRepository,
                           UserRepository userRepository,
                           CityRepository cityRepository,
                           TripStopRepository tripStopRepository,
                           TripCollaboratorRepository collaboratorRepository,
                           ModelMapper modelMapper) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.cityRepository = cityRepository;
        this.tripStopRepository = tripStopRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public TripResponse createTrip(UUID userId, TripRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = Trip.builder()
                .user(user)
                .tripName(request.getTripName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .coverPhotoUrl(request.getCoverPhotoUrl())
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .totalBudget(request.getTotalBudget())
                .build();

        Trip savedTrip = tripRepository.save(trip);

        // Add stops if provided
        if (request.getStops() != null && !request.getStops().isEmpty()) {
            for (TripStopRequest stopReq : request.getStops()) {
                City city = cityRepository.findById(stopReq.getCityId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "City not found: " + stopReq.getCityId()));
                TripStop stop = TripStop.builder()
                        .trip(savedTrip)
                        .city(city)
                        .arrivalDate(stopReq.getArrivalDate())
                        .departureDate(stopReq.getDepartureDate())
                        .stopOrder(stopReq.getStopOrder())
                        .notes(stopReq.getNotes())
                        .build();
                tripStopRepository.save(stop);
            }
        }

        log.info("Trip created: {} by user {}", savedTrip.getTripName(), userId);
        return toTripResponse(tripRepository.findById(savedTrip.getTripId()).orElse(savedTrip));
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse getTripById(UUID tripId, UUID userId) {
        Trip trip = findTripOrThrow(tripId);
        // Allow if owner, collaborator, or public trip
        boolean isOwner = trip.getUser().getUserId().equals(userId);
        boolean isCollaborator = collaboratorRepository.existsByTripTripIdAndUserUserId(tripId, userId);
        if (!isOwner && !isCollaborator && !trip.getIsPublic()) {
            throw new ResourceNotFoundException("Trip not found or access denied");
        }
        return toTripResponse(trip);
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse getTripByShareToken(String shareToken) {
        Trip trip = tripRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid share link"));
        return toTripResponse(trip);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getUserTrips(UUID userId) {
        return tripRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toTripResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getSharedTrips(UUID userId) {
        return tripRepository.findSharedWithUser(userId)
                .stream().map(this::toTripResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getPublicTrips() {
        return tripRepository.findPublicTrips()
                .stream().map(this::toTripResponse).collect(Collectors.toList());
    }

    @Override
    public TripResponse updateTrip(UUID tripId, UUID userId, TripRequest request) {
        Trip trip = findTripOwnedBy(tripId, userId);

        trip.setTripName(request.getTripName());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        if (request.getCoverPhotoUrl() != null) trip.setCoverPhotoUrl(request.getCoverPhotoUrl());
        if (request.getIsPublic() != null) trip.setIsPublic(request.getIsPublic());
        if (request.getTotalBudget() != null) trip.setTotalBudget(request.getTotalBudget());

        Trip updated = tripRepository.save(trip);
        log.info("Trip updated: {}", tripId);
        return toTripResponse(updated);
    }

    @Override
    public TripResponse updateTripStatus(UUID tripId, UUID userId, String status) {
        Trip trip = findTripOwnedBy(tripId, userId);
        trip.setStatus(status);
        return toTripResponse(tripRepository.save(trip));
    }

    @Override
    public String generateShareToken(UUID tripId, UUID userId) {
        Trip trip = findTripOwnedBy(tripId, userId);
        if (trip.getShareToken() == null) {
            byte[] bytes = new byte[24];
            RANDOM.nextBytes(bytes);
            trip.setShareToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes));
            tripRepository.save(trip);
        }
        return trip.getShareToken();
    }

    @Override
    public void deleteTrip(UUID tripId, UUID userId) {
        Trip trip = findTripOwnedBy(tripId, userId);
        tripRepository.delete(trip);
        log.info("Trip deleted: {} by user {}", tripId, userId);
    }

    @Override
    public void addCollaborator(UUID tripId, UUID ownerId, String collaboratorEmail, String role) {
        findTripOwnedBy(tripId, ownerId); // verify ownership

        User collaborator = userRepository.findByEmail(collaboratorEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with email '" + collaboratorEmail + "' not found"));

        if (collaborator.getUserId().equals(ownerId)) {
            throw new DuplicateResourceException("Cannot add yourself as a collaborator");
        }

        if (collaboratorRepository.existsByTripTripIdAndUserUserId(tripId, collaborator.getUserId())) {
            throw new DuplicateResourceException("User is already a collaborator on this trip");
        }

        Trip trip = findTripOrThrow(tripId);
        TripCollaborator collab = TripCollaborator.builder()
                .trip(trip)
                .user(collaborator)
                .role(role != null ? role : "viewer")
                .build();
        collaboratorRepository.save(collab);
        log.info("Collaborator {} added to trip {} as {}", collaboratorEmail, tripId, role);
    }

    @Override
    public void removeCollaborator(UUID tripId, UUID ownerId, UUID collaboratorId) {
        findTripOwnedBy(tripId, ownerId);
        TripCollaborator collab = collaboratorRepository.findById(collaboratorId)
                .orElseThrow(() -> new ResourceNotFoundException("Collaborator not found"));
        collaboratorRepository.delete(collab);
    }

    // ── Helpers ──

    private Trip findTripOrThrow(UUID tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));
    }

    private Trip findTripOwnedBy(UUID tripId, UUID userId) {
        Trip trip = findTripOrThrow(tripId);
        if (!trip.getUser().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Trip not found or access denied");
        }
        return trip;
    }

    private TripResponse toTripResponse(Trip trip) {
        List<TripStopResponse> stopResponses = trip.getStops().stream()
                .map(this::toStopResponse)
                .collect(Collectors.toList());

        UserResponse ownerResponse = modelMapper.map(trip.getUser(), UserResponse.class);

        return TripResponse.builder()
                .tripId(trip.getTripId())
                .tripName(trip.getTripName())
                .description(trip.getDescription())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .coverPhotoUrl(trip.getCoverPhotoUrl())
                .status(trip.getStatus())
                .isPublic(trip.getIsPublic())
                .shareToken(trip.getShareToken())
                .totalBudget(trip.getTotalBudget())
                .owner(ownerResponse)
                .stops(stopResponses)
                .collaboratorCount(trip.getCollaborators().size())
                .createdAt(trip.getCreatedAt())
                .updatedAt(trip.getUpdatedAt())
                .build();
    }

    private TripStopResponse toStopResponse(TripStop stop) {
        CityResponse cityResp = modelMapper.map(stop.getCity(), CityResponse.class);
        List<TripActivityResponse> activityResponses = stop.getActivities().stream()
                .map(this::toActivityResponse)
                .collect(Collectors.toList());

        return TripStopResponse.builder()
                .stopId(stop.getStopId())
                .city(cityResp)
                .arrivalDate(stop.getArrivalDate())
                .departureDate(stop.getDepartureDate())
                .stopOrder(stop.getStopOrder())
                .notes(stop.getNotes())
                .activities(activityResponses)
                .build();
    }

    private TripActivityResponse toActivityResponse(TripActivity ta) {
        return TripActivityResponse.builder()
                .tripActivityId(ta.getTripActivityId())
                .activityId(ta.getActivity() != null ? ta.getActivity().getActivityId() : null)
                .activityName(ta.getActivity() != null ? ta.getActivity().getActivityName() : ta.getCustomName())
                .category(ta.getActivity() != null ? ta.getActivity().getCategory() : null)
                .customName(ta.getCustomName())
                .scheduledDate(ta.getScheduledDate())
                .scheduledTime(ta.getScheduledTime())
                .estimatedCost(ta.getActivity() != null ? ta.getActivity().getEstimatedCost() : null)
                .actualCost(ta.getActualCost())
                .status(ta.getStatus())
                .notes(ta.getNotes())
                .durationMinutes(ta.getActivity() != null ? ta.getActivity().getDurationMinutes() : null)
                .build();
    }
}
