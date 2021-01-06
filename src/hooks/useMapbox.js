import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRyaXRvbiIsImEiOiJja2psN3VmbnYyMTVsMnJvN3g5bDRqN2p4In0.vpLOz9s-SBLf4Mu6Z51HPg';

export const useMapbox = (puntoInicial) => {
  // Referencia al div del mapa
  const mapaDiv = useRef();
  // Guardamos una función que memoriza el producto, solo cuándo el input cambia
  // El useCallback lo usamos porque si no cada vez que se renderiza el hijo, redefinimos el valor
  const setRef = useCallback((node) => {
    mapaDiv.current = node;
  }, []);

  // Referencia a los marcadores
  const marcadores = useRef({});

  // Mapa y coords
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
  }, [puntoInicial]);

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

  // Agregar marcadores cuando hacemos click
  useEffect(() => {
    mapa.current?.on('click', (ev) => {
      const { lng, lat } = ev.lngLat;
      const marker = new mapboxgl.Marker();
      marker.id = v4(); //TODO: si el marcador ya tiene ID
      marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);
      marcadores.current[marker.id] = marker;
    });
    return () => {
      mapa.current?.off('click');
    };
  }, []);
  return { coords, marcadores, setRef };
};
