import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRecoilValue } from "recoil";
import { locationDataAtom, searchedVillageAtom } from "../atoms";

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
  const searchedVillage = useRecoilValue(searchedVillageAtom);
  const locationData = useRecoilValue<LocationData[]>(locationDataAtom);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Normalize data to always be array
  const data = searchedVillage ? [searchedVillage as LocationData] : locationData;

  useEffect(() => {
    if (!mapContainerRef.current) return;
  
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 1,
      maxBounds: [-180, -90, 180, 90],
    });
  
    let bounds: mapboxgl.LngLatBounds | null = null;

    data.forEach((location: LocationData) => {
      const latitude = parseFloat(location.latitude);
      const longitude = parseFloat(location.longitude);
  
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        console.warn(`Invalid coordinates for location: ${location.name}`);
        return;
      }
  
      const popup = new mapboxgl.Popup({ offset: 25, className: 'popup' })
        .setHTML(`
          <div>
            <p><strong>Village:</strong> ${location.name}</p>
            <p><strong>Province:</strong> ${location.province}</p>
            <p><strong>Population:</strong> ${location.population}</p>
          </div>
        `);
  
      const marker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map);
  
      if (bounds) {
        bounds.extend(marker.getLngLat());
      } else {
        bounds = new mapboxgl.LngLatBounds(marker.getLngLat(), marker.getLngLat());
      }
    });
  
    if (bounds) {
      map.fitBounds(bounds, { padding: 50 });
    }
  
    return () => {
      map.remove();
    };
  }, [data]);
  

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
    />
  );
};

export default InteractiveGlobe;