import React, { useEffect, useRef } from 'react';

const BigMap = ({ latitude, longitude, smallSize }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: latitude, lng: longitude },
      draggable: true, // Enable dragging for big-map
      zoomControl: true, // Enable zoom control for big-map
      scrollwheel: true, // Enable scroll wheel for big-map
      disableDoubleClickZoom: false, // Enable double click zoom for big-map
      fullscreenControl: true, // Enable fullscreen control for big-map
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

export default BigMap;
