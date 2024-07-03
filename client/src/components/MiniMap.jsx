import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../constants';

const MiniMap = ({ latitude, longitude, smallSize }) => {
  const mapRef = useRef(null);

  const MAP_ID = '863523338aece9f';

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['marker'], // Add the marker library
    });

    loader
      .importLibrary('maps')
      .then(() => {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 14,
          center: { lat: latitude, lng: longitude },
          draggable: false, // Disable dragging for mini-map
          zoomControl: false, // Disable zoom control for mini-map
          scrollwheel: false, // Disable scroll wheel for mini-map
          disableDoubleClickZoom: true, // Disable double click zoom for mini-map
          fullscreenControl: false, // Disable fullscreen control for mini-map
          mapId: MAP_ID,
        });

        loader.importLibrary('marker').then(() => {
          new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: latitude, lng: longitude },
            map: map,
          });
        });
      })
      .catch((e) => {
        console.error('Error loading Google Maps', e);
      });
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${smallSize ? 'rounded' : ''}`}
      style={{
        height: smallSize ? '100%' : '300px',
        width: smallSize ? '100%' : '100%',
      }}
    />
  );
};

export default MiniMap;
