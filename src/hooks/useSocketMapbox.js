import { useEffect } from 'react';
import { useMapbox } from './useMapbox';

const puntoInicial = {
  lng: -0.3757,
  lat: 39.4969,
  zoom: 15.18,
};
export const useSocketMapbox = (socket) => {
  const {
    coords,
    setRef,
    nuevoMarcador$,
    movimientoMarcador$,
    agregarMarcador,
    actualizarPosicion,
  } = useMapbox(puntoInicial);
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
      socket.emit('marcador-nuevo', marcador);
    });
  }, [nuevoMarcador$, socket]);

  // Movimiento del marcador
  useEffect(() => {
    movimientoMarcador$.current.subscribe((marcador) => {
      socket.emit('marcador-actualizado', marcador);
    });
  }, [movimientoMarcador$, socket]);

  // Mover marcador mediante sockets
  useEffect(() => {
    socket.on('marcador-actualizado', (marcador) => {
      actualizarPosicion(marcador);
    });
  }, [socket, actualizarPosicion]);

  // Escuchar marcadores
  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      agregarMarcador(marcador, marcador.id);
    });
  }, [socket, agregarMarcador]);
  return { coords, setRef };
};
