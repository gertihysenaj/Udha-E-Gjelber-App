import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import '../styles/MapStyles.css';



const MapComponent = ({ originLatLng, destinationLatLng }) => {
  const [response, setResponse] = useState(null);
  const [center, setCenter] = useState({ lat: 41.33, lng: 19.82 }); // Initial Center

  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === 'OK') {
      setResponse(res);
    } else {
      console.error(`error fetching directions ${res}`);
    }
  }, []);

  useEffect(() => {
    if (originLatLng && destinationLatLng) {
      const midLat = (originLatLng.lat + destinationLatLng.lat) / 2;
      const midLng = (originLatLng.lng + destinationLatLng.lng) / 2;
      setCenter({ lat: midLat, lng: midLng });
    }
  }, [originLatLng, destinationLatLng]);


  const markerOptions = {

    icon: {
      url: 'path-to-icon.png',
      scaledSize: new window.google.maps.Size(40, 40),
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12.5}
      >
        {originLatLng && destinationLatLng && (
          <>
            <DirectionsService
              options={{
                destination: destinationLatLng,
                origin: originLatLng,
                travelMode: 'DRIVING',
              }}
              callback={directionsCallback}
            />
            <Marker position={originLatLng} options={markerOptions} />
            <Marker position={destinationLatLng} options={markerOptions} />
          </>
        )}
        {response !== null && <DirectionsRenderer options={{ directions: response, suppressMarkers: true }} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;










