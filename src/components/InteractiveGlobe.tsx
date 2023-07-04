import React, { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl, { LngLatBoundsLike, LngLatLike } from "mapbox-gl";
import itribeSymbol from "../assets/itribes-symbol.png";
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
  const [currentPopup, setCurrentPopup] = useState<mapboxgl.Popup | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentBounds, setCurrentBounds] = useState<LngLatBoundsLike>([
    [-180, -90],
    [180, 90],
  ]);

  const filteredData = useMemo(
    () =>
      communitiesData
        .filter((community) =>
          community.village_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(
          (community) => community.longitude !== null && community.latitude !== null
        ),
    [communitiesData, searchTerm]
  );

  useEffect(() => {
    if (!mapContainerRef.current || !filteredData.length) return;
    if (!mapRef.current) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiYmFydWNoLWsiLCJhIjoiY2xpdDM3dnJqMGwxMDNobzc3emJtYndlaiJ9.mLMAW4ATqzmqjYW49Quo9Q";
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        mapStyle: "mapbox://styles/mapbox/streets-v12",
        center: [0, 0] as LngLatLike,
        zoom: 1,
        maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
      });
  
      // Add a 'load' event listener to the map
      mapRef.current.on('load', () => {
        filteredData.forEach((community) => {
          const markerEl = document.createElement("div");
          markerEl.className = "marker";
          Object.assign(markerEl.style, markerStyle);
  
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false,
            className: darkMode ? "dark-mode-popup text-black" : "",
          }).setHTML(
            `<h3 class="${
              darkMode ? "text-green-500" : ""
            }">${community.village_name}</h3>`
          );
  
          const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([
              community.longitude as number,
              community.latitude as number,
            ] as LngLatLike)
            .setPopup(popup)
            .addTo(mapRef.current!);
  
          marker.getElement().addEventListener("click", () => {
            const tribeInfo: TribeInfo = {
              name: community.village_name,
              population: community.population,
              country: community.province,
              city: community.district,
              community: community.village_name,
            };
            handleMarkerClick(tribeInfo);
          });
        });
      });
    };

    let newBounds: LngLatBoundsLike = [
      [-180, -90],
      [180, 90],
    ];

    if (filteredData.length === 1) {
      const { longitude: lng, latitude: lat } = filteredData[0];
      if (typeof lng === "number" && typeof lat === "number") {
        const offset = 0.05; // Adjust the offset value to a smaller value
        newBounds = [
          [lng - offset, lat - offset],
          [lng + offset, lat + offset],
        ];
      }
    } else if (filteredData.length > 1) {
      const lats = filteredData.map((community) => community.latitude as number);
      const lngs = filteredData.map((community) => community.longitude as number);
      newBounds = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];
    }

    setCurrentBounds(newBounds);

    return () => {
      if (currentPopup) {
        currentPopup.remove();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [filteredData, darkMode, mapRef, setCurrentBounds]);

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

  const markerStyle: React.CSSProperties = {
    backgroundImage: `url(${itribeSymbol})`,
    backgroundSize: "cover",
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    cursor: "pointer",
  };

  return (
    <div
      className={`map-container relative h-full ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-green-700"
      }`}
    >
      <div className="absolute top-0 left-0 p-5 w-full">
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
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default InteractiveGlobe;
