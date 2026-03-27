import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onPick({ lat, lng });
    },
  });
  return null;
};

const LocationPicker = ({ value, onChange }) => {
  const center = value?.lat && value?.lng ? [value.lat, value.lng] : [41.3111, 69.2797];

  return (
    <div className="space-y-2">
      <MapContainer center={center} zoom={12} className="h-64 w-full overflow-hidden rounded-2xl">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onPick={onChange} />
        {value?.lat && value?.lng ? <Marker position={[value.lat, value.lng]} /> : null}
      </MapContainer>
      <p className="text-xs text-slate-600">
        Xaritada joyni bosing. Tanlangan nuqta: {value?.lat?.toFixed?.(5) || "-"}, {value?.lng?.toFixed?.(5) || "-"}
      </p>
    </div>
  );
};

export default LocationPicker;
