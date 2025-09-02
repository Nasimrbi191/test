import { MapContainer, TileLayer } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import Recenter from '../Recenter/Recenter';
import LocateButton from '../LocateButton/LocateButton';
import MapMarker from '../MapMarker/MapMarker';
import "leaflet-routing-machine";
import Routing from '../Routing/Routing';



function MapComponent() {
    const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);
    const fallbackPosition: LatLngExpression = [36.7500, 54.4667];

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            return;
        }
    }, []);

    const handleLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords: LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
                console.log("User location:", coords);
                setCurrentPosition(coords);
            },
            (err) => {
                console.error("Geolocation error:", err);
            }
        );
    }

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MapContainer
                center={currentPosition ? currentPosition : fallbackPosition}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <MapMarker
                    currentPosition={currentPosition}
                    setCurrentPosition={setCurrentPosition}
                    fallbackPosition={fallbackPosition} /> */}
                <Routing />
                {(currentPosition || fallbackPosition) && <Recenter position={currentPosition ? currentPosition : fallbackPosition} />}
                {/* <LocateButton onLocate={handleLocation} /> */}
            </MapContainer>
        </div>
    );
}

export default MapComponent;
