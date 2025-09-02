import L from 'leaflet';

const currentLocationIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],     // size of the icon
    iconAnchor: [12, 41],   // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34],  // point from which the popup should open relative to the iconAnchor
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
});

export default currentLocationIcon
