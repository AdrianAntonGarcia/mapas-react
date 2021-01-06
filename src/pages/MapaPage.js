import React, { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
  lng: -0.3757,
  lat: 39.4969,
  zoom: 15.18,
};

export const MapaPage = () => {
  const { coords, setRef, nuevoMarcador$ } = useMapbox(puntoInicial);
  useEffect(() => {
    nuevoMarcador$.current.subscribe((marcador) => {
      console.log('MapaPage: ' + marcador);
    });
  }, [nuevoMarcador$]);

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainter" />
    </>
  );
};
