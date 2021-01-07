import React, { useContext } from 'react';
import { SocketContex } from '../context/SocketContext';
import { useSocketMapbox } from '../hooks/useSocketMapbox';

export const MapaPage = () => {
  const { socket } = useContext(SocketContex);
  const { coords, setRef } = useSocketMapbox(socket);
  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainter" />
    </>
  );
};
