import React, { useContext, useEffect } from 'react';
import { SocketContex } from '../context/SocketContext';
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

  const { socket } = useContext(SocketContex);

  // Nuevo marcador
  useEffect(() => {
    nuevoMarcador$.current.subscribe((marcador) => {
      socket.emit('marcador-nuevo', marcador);
    });
  }, [nuevoMarcador$, socket]);

  // Movimiento del marcador
  useEffect(() => {
    movimientoMarcador$.current.subscribe((marcador) => {
      console.log(JSON.stringify(marcador));
    });
  }, [movimientoMarcador$]);

  // Escuchar marcadores

  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      console.log(marcador);
    });
  }, [socket]);

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainter" />
    </>
  );
};
