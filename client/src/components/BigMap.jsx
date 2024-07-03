import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../constants';

const MAP_ID = '863523338aece9f';

const BigMap = ({ latitude, longitude, smallSize }) => {
  const mapRef = useRef(null);

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
          draggable: true, // Enable dragging for big-map
          zoomControl: true, // Enable zoom control for big-map
          scrollwheel: true, // Enable scroll wheel for big-map
          disableDoubleClickZoom: false, // Enable double click zoom for big-map
          fullscreenControl: true, // Enable fullscreen control for big-map
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

export default BigMap;
