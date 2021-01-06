import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRyaXRvbiIsImEiOiJja2psN3VmbnYyMTVsMnJvN3g5bDRqN2p4In0.vpLOz9s-SBLf4Mu6Z51HPg';

const puntoInicial = {
  lng: -0.3757,
  lat: 39.4969,
  zoom: 15.18,
};
export const MapaPage = () => {
  const mapaDiv = useRef();
  //   const [mapa, setMapa] = useState(null);
  const mapa = useRef();

  const [coords, setCoords] = useState(puntoInicial);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom,
    });
    mapa.current = map;
  }, []);

  // Cuándo se mueve el mapa
  useEffect(() => {
    mapa.current?.on('move', () => {
      const { lng, lat } = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2),
      });
    });
    return mapa.current?.off('move');
  }, []);
  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={mapaDiv} className="mapContainter" />
    </>
  );
};
