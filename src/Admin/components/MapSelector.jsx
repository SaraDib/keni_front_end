import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Correction des icônes de marqueurs
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Composant pour gérer les événements de la carte
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

const MapSelector = ({ value, onChange }) => {
  // Valeur par défaut centrée sur le Maroc
  const defaultPosition = [31.7917, -7.0926];
  const [position, setPosition] = useState(value ? JSON.parse(value) : defaultPosition);
  
  // Mettre à jour la valeur externe lorsque la position change
  useEffect(() => {
    if (onChange) {
      onChange(JSON.stringify(position));
    }
  }, [position, onChange]);

  return (
    <div className="map-container">
      <p className="text-sm text-gray-500 mb-2">Cliquez sur la carte pour sélectionner la position du centre</p>
      <MapContainer 
        center={position} 
        zoom={6} 
        style={{ height: '400px', width: '100%', borderRadius: '0.375rem' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="mt-2 text-sm text-gray-600">
        Position: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </div>
    </div>
  );
};

export default MapSelector;