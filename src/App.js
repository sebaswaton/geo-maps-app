import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultPosition = [40.4168, -3.7038]; // Madrid

function Search({ onSelectPosition }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 999 }}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          placeholder="Buscar lugar..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, minWidth: 180 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 4 }}>Buscar</button>
      </form>
      {results.length > 0 && (
        <ul style={{ background: "#fff", padding: 8, borderRadius: 4, margin: 0, listStyle: "none" }}>
          {results.map((place) => (
            <li key={place.place_id} style={{ cursor: "pointer", margin: "4px 0" }} onClick={() => onSelectPosition([parseFloat(place.lat), parseFloat(place.lon)], place.display_name)}>
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChangeMapView({ coords }) {
  const map = useMap();
  if (coords) map.setView(coords, 14);
  return null;
}

// Icon for marker
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function App() {
  const [marker, setMarker] = useState({ position: defaultPosition, label: "Madrid" });

  const handleSelectPosition = (coords, label) => {
    setMarker({ position: coords, label });
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Search onSelectPosition={handleSelectPosition} />
      <MapContainer center={marker.position} zoom={13} style={{ height: "100vh", width: "100vw" }}>
        <ChangeMapView coords={marker.position} />
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={marker.position} icon={markerIcon}>
          <Popup>{marker.label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;