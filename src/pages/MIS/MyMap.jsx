import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix broken default marker icons using CDN paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "../../../public/leaflet/marker-icon-2x.png",
  iconUrl:
    "../../../public/leaflet/marker-icon.png",
  shadowUrl:
    "../../../public/leaflet/marker-shadow.png",
});



const locations = [
  { city: "Delhi", position: [28.6139, 77.209], users: 120 },
  { city: "Mumbai", position: [19.076, 72.8777], users: 85 },
  { city: "IT Dose", position: [28.595574, 77.3203701], users: 270 },
];

// Define map styles
const mapStyles = {
  normal: {
    name: "Street",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "&copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
};

const MyMap = () => {
  const [mapType, setMapType] = useState("normal"); // 'normal' or 'satellite'

  return (
    <div style={{ border: "1px solid grey", borderRadius: "5px" }}>
      <div style={{ textAlign: "center", fontWeight: "bold" }}>
        Hospital's Demographic Data
      </div>

      {/* Map */}
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={4}
        style={{ height: "256px", width: "100%", borderRadius: "8px" }}
        attributionControl={false}
      >
        <TileLayer
          url={mapStyles[mapType].url}
          attribution={mapStyles[mapType].attribution}
        />
        {locations.map((loc, idx) => (
          <Marker key={idx} position={loc.position}>
            <Popup>
              {loc.city} — Patients: {loc.users}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div
        style={{
          position: "absolute",
          top: 22,
          right: 5,
          backgroundColor: "white",
          padding: "8px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setMapType("normal")}
          style={{
            padding: "6px",
            backgroundColor: mapType === "normal" ? "#eee" : "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          title="Street View"
        >
          🛣️
        </button>
        <button
          onClick={() => setMapType("satellite")}
          style={{
            padding: "6px",
            backgroundColor: mapType === "satellite" ? "#eee" : "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          title="Satellite View"
        >
          🛰️
        </button>
      </div>
    </div>
  );
};

export default MyMap;
