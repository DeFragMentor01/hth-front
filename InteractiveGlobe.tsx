import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRecoilValue } from "recoil";
import { locationDataAtom } from "../atoms";

// Define the location data interface
interface LocationData {
  id: number;
  no: number;
  province: string;
  district: string;
  name: string;
  latitude: string;
  longitude: string;
  area_square_meter: string;
  hectares: string;
  shape_length: string;
  population: number;
  district_id: number;
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmFydWNoLWsiLCJhIjoiY2xpdDM3dnJqMGwxMDNobzc3emJtYndlaiJ9.mLMAW4ATqzmqjYW49Quo9Q";

const InteractiveGlobe: React.FC = () => {
  // Specify the type when using the recoil value
  const locationData = useRecoilValue<LocationData[]>(locationDataAtom);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !locationData.length) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 1,
      maxBounds: [-180, -90, 180, 90],
    });

    // Define the initial bounds
    let bounds = new mapboxgl.LngLatBounds();

    // Loop through each item in locationData
    locationData.forEach((location) => {
      // Create a popup
      const popup = new mapboxgl.Popup({ offset: 25, className: 'popup' })
        .setHTML(`
          <div>
            <p><strong>Village:</strong> ${location.name}</p>
            <p><strong>Province:</strong> ${location.province}</p>
            <p><strong>Population:</strong> ${location.population}</p>
          </div>
        `);

      // Create a marker and add it to the map
      const marker = new mapboxgl.Marker()
        .setLngLat([parseFloat(location.longitude), parseFloat(location.latitude)])
        .setPopup(popup) // attach the popup to the marker
        .addTo(map);

      // Extend the bounds to include the marker's position
      bounds.extend(marker.getLngLat());
    });

    // After all markers have been created, fit the map to the bounds
    map.fitBounds(bounds, { padding: 50 });

    return () => {
      map.remove();
    };
}, [locationData]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
    />
  );
};

export default InteractiveGlobe;