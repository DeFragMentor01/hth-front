import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatBoundsLike, LngLatLike } from "mapbox-gl";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../atoms";
import "mapbox-gl/dist/mapbox-gl.css";

interface CommunityData {
  population: number;
  province: string;
  district: string;
  village_name: string;
  longitude: number | null;
  latitude: number | null;
}

interface InteractiveGlobeProps {
  communitiesData: CommunityData[];
  handleMarkerClick: (tribeInfo: TribeInfo | null) => void;
}

interface TribeInfo {
  name: string;
  population: number;
  country: string;
  city: string;
  community: string;
}

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  communitiesData,
  handleMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const darkMode = useRecoilValue(darkModeAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentBounds, setCurrentBounds] = useState<LngLatBoundsLike>([
    [-180, -90],
    [180, 90],
  ]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapRef.current) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiYmFydWNoLWsiLCJhIjoiY2xqb3d4bHd1MGJ5dTNkczk3N2VwdWhrNiJ9.7U3cdRrr-t8sU0lHu2G-rg";
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 0] as LngLatLike,
        zoom: 1,
        maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
      });
    }

    setCurrentBounds([
      [-180, -90],
      [180, 90],
    ]);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitBounds(currentBounds, { padding: 50 });
    }
  }, [currentBounds]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  return (
    <div className="map-container relative h-full">
      <div className="absolute top-0 left-0 p-5 w-full z-10">
        <form onSubmit={handleSearch}>
          <div className="flex items-center justify-between">
            <input
              className={`${
                darkMode ? "bg-gray-200 text-black" : "bg-white"
              } w-full p-2 rounded-lg mr-2 outline-none`}
              placeholder="Search village..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              type="submit"
              className={`${
                darkMode ? "bg-green-500 text-white" : "bg-green-700 text-white"
              } p-2 rounded-lg`}
            >
              Search
            </button>
            <button
              type="button"
              className={`${
                darkMode ? "bg-red-500 text-white" : "bg-red-700 text-white"
              } p-2 rounded-lg ml-2`}
              onClick={clearSearch}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        className="z-0"
      />
    </div>
  );
};

export default InteractiveGlobe;
