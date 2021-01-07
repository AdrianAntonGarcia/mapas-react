import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

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

  // Observables de rxjs
  const movimientoMarcador = useRef(new Subject());
  // Observable al que me puedo subscribir y emitar eventos
  const nuevoMarcador = useRef(new Subject());

  // Mapa y coords
  const mapa = useRef();
  const [coords, setCoords] = useState(puntoInicial);

  // Función para agregar marcadores
  const agregarMarcador = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev;
    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();
    marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);
    // Asignamos al objeto de marcadores
    marcadores.current[marker.id] = marker;
    // Emitimos que se creo un nuevo marcador, si el marcador tiene id no emitir
    if (!id) {
      nuevoMarcador.current.next({ id: marker.id, lng, lat });
    }

    // Escuchar movimientos del marcador
    marker.on('drag', ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      // TODO: emitir los cambios del marcador
      // Emitimos que se movio
      movimientoMarcador.current.next({ id, lng, lat });
    });
  }, []);

  // Función para actualizar la ubicación del marcador
  const actualizarPosicion = useCallback(({ id, lng, lat }) => {
    marcadores.current[id].setLngLat([lng, lat]);
  }, []);

  // Inicializamos el mapa
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
      agregarMarcador(ev);
    });
    return () => {
      mapa.current?.off('click');
    };
  }, [agregarMarcador]);
  return {
    agregarMarcador,
    actualizarPosicion,
    coords,
    marcadores,
    nuevoMarcador$: nuevoMarcador,
    movimientoMarcador$: movimientoMarcador,
    setRef,
  };
};
