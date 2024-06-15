import React, { useEffect, useRef } from 'react';

const MiniMap = ({ latitude, longitude, smallSize }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: latitude, lng: longitude },
      draggable: false, // Disable dragging for mini-map
      zoomControl: false, // Disable zoom control for mini-map
      scrollwheel: false, // Disable scroll wheel for mini-map
      disableDoubleClickZoom: true, // Disable double click zoom for mini-map
      fullscreenControl: false, // Disable fullscreen control for mini-map
    });

    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
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
