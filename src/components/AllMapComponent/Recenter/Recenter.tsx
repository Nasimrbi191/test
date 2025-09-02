import type { LatLngExpression } from 'leaflet';
import React, { useEffect } from 'react'
import { useMap } from "react-leaflet";

function Recenter({ position }: { position: LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
         map.flyTo(position, 18, { animate: true });
    }, [position, map]);
    return null;
}

export default Recenter
