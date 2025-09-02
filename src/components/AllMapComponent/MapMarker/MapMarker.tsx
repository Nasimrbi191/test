import { Marker, Popup } from "react-leaflet";
import currentLocationIcon from "../currentLocationIcon/currentLocationIcon";
import { useMemo, useRef } from "react";
import L, { LatLng } from "leaflet";

interface MapMarkerProps {
    currentPosition: LatLng | [number, number] | null;
    fallbackPosition: [number, number];
    setCurrentPosition: (pos: [number, number]) => void;
}

function MapMarker({ currentPosition, setCurrentPosition, fallbackPosition }: MapMarkerProps) {
    const markerRef = useRef<L.Marker | null>(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const latlng = marker.getLatLng();
                    console.log("Dragged to:",latlng);
                    setCurrentPosition([latlng.lat, latlng.lng]);
                }
            },
        }),
        [setCurrentPosition]
    );
    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={currentPosition || fallbackPosition}
            icon={currentLocationIcon}
            ref={markerRef}
        >
            <Popup>
                {currentPosition ? "You are here! (draggable)" : "Default location"}
            </Popup>
        </Marker>
    );
}

export default MapMarker;
