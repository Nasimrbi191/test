import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

function Routing() {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(36.7500, 54.4667), 
        L.latLng(36.8416, 54.4361), 
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      lineOptions: { styles: [{ color: "#6FA1EC", weight: 4 }] },
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map]);

  return null;
}

export default Routing;
