import React, { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
  lng: -0.3757,
  lat: 39.4969,
  zoom: 15.18,
};

export const MapaPage = () => {
  const { coords, setRef, nuevoMarcador$, movimientoMarcador$ } = useMapbox(
    puntoInicial
  );
  useEffect(() => {
    nuevoMarcador$.current.subscribe((marcador) => {});
  }, [nuevoMarcador$]);

  useEffect(() => {
    movimientoMarcador$.current.subscribe((marcador) => {
      console.log(JSON.stringify(marcador));
    });
  }, [movimientoMarcador$]);

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainter" />
    </>
  );
};
