import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map when stops change
function MapRecenter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      if (positions.length === 1) {
        map.setView(positions[0], 10);
      } else {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [positions, map]);
  return null;
}

export default function TripMap({ stops, tripCity, tripCountry }) {
  const [positions, setPositions] = useState([]);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);

  useEffect(() => {
    const loadMapData = async () => {
      if (stops && stops.length > 0) {
        const validStops = stops.filter(s => s.city?.latitude && s.city?.longitude);
        setPositions(validStops.map(s => [s.city.latitude, s.city.longitude]));
      } else if (tripCity || tripCountry) {
        setIsLoadingDestination(true);
        try {
          const query = encodeURIComponent(`${tripCity || ''} ${tripCountry || ''}`.trim());
          const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
          if (res.data && res.data.length > 0) {
            setPositions([[parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]]);
          }
        } catch (err) {
          console.error("Failed to fetch map coordinates for trip destination", err);
        } finally {
          setIsLoadingDestination(false);
        }
      }
    };
    loadMapData();
  }, [stops, tripCity, tripCountry]);

  if (isLoadingDestination) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-neutral-50 rounded-2xl border border-neutral-200/50">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const defaultCenter = positions.length > 0 ? positions[0] : [20, 0];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stops.map((stop, index) => {
          if (!stop.city?.latitude || !stop.city?.longitude) return null;
          return (
            <Marker key={stop.stopId || index} position={[stop.city.latitude, stop.city.longitude]}>
              <Popup>
                <strong>{stop.city.cityName}</strong><br/>
                {stop.city.country}
              </Popup>
            </Marker>
          );
        })}
        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="#2D5F5D" 
            weight={3} 
            opacity={0.7} 
            dashArray="10, 10" 
          />
        )}
        <MapRecenter positions={positions} />
      </MapContainer>
    </div>
  );
}
