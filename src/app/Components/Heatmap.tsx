"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { useEffect } from "react";
import { HeatmapProps } from "@/types/HeatmapProps";


function HeatLayer({ points }: any) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 1,
      maxZoom: 17,
      minOpacity: 0.2,
      gradient: {0.1: 'purple', 1: 'red'}
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default function Heatmap({ points }: HeatmapProps) {
  return (
    <MapContainer
      center={[51.4381, 5.4752]}
      zoom={15}
      // className="h-9/10 w-full"
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <HeatLayer points={points} />
    </MapContainer>
  );
}
