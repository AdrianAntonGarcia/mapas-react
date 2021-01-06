import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRyaXRvbiIsImEiOiJja2psN3VmbnYyMTVsMnJvN3g5bDRqN2p4In0.vpLOz9s-SBLf4Mu6Z51HPg';

const puntoInicial = {
  lng: 5,
  lat: 34,
  zoom: 2,
};
export const MapaPage = () => {
  const mapaDiv = useRef();
  const [, setMapa] = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom,
    });

    setMapa(map);
  }, []);
  return (
    <>
      <div ref={mapaDiv} className="mapContainter" />
    </>
  );
};
