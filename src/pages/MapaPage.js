import React from 'react';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
  lng: -0.3757,
  lat: 39.4969,
  zoom: 15.18,
};

export const MapaPage = () => {
  const { coords, setRef } = useMapbox(puntoInicial);
  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainter" />
    </>
  );
};
