import React, { useContext, useEffect } from 'react';
import { SocketContex } from '../context/SocketContext';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
  lng: -0.3757,
  lat: 39.4969,
  zoom: 15.18,
};

export const MapaPage = () => {
  const {
    coords,
    setRef,
    nuevoMarcador$,
    movimientoMarcador$,
    agregarMarcador,
  } = useMapbox(puntoInicial);

  const { socket } = useContext(SocketContex);

  // Escuchar los marcadores existentes

  useEffect(() => {
    socket.on('marcadores-activos', (marcadores) => {
      for (const key of Object.keys(marcadores)) {
        agregarMarcador(marcadores[key], key);
      }
    });
  }, [socket, agregarMarcador]);
  // Nuevo marcador
  useEffect(() => {
    nuevoMarcador$.current.subscribe((marcador) => {
      socket.emit('marcador-nuevo', marcador, marcador.id);
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
      agregarMarcador(marcador);
    });
  }, [socket, agregarMarcador]);

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainter" />
    </>
  );
};
