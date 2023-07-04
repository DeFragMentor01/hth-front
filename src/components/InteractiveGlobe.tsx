import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatBoundsLike, LngLatLike } from "mapbox-gl";
import itribeSymbol from "../assets/itribes-symbol.png";
import globeSkin from "../assets/texture-earth.jpeg";
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
  const darkMode = useRecoilValue(darkModeAtom);
  const [currentPopup, setCurrentPopup] = useState<mapboxgl.Popup | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmFydWNoLWsiLCJhIjoiY2xpdDM3dnJqMGwxMDNobzc3emJtYndlaiJ9.mLMAW4ATqzmqjYW49Quo9Q";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0] as LngLatLike,
      zoom: 1,
      maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
    });

    mapRef.current = map;

    return () => {
      if (currentPopup) {
        currentPopup.remove();
      }
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !communitiesData.length) return;

    const filteredData = communitiesData
      .filter((community) =>
        community.village_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .filter(
        (community) =>
          community.longitude !== null && community.latitude !== null
      );

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create new markers
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
        .addTo(mapRef.current!); // Use non-null assertion operator here

      marker.getElement()!.addEventListener("click", () => {
        const tribeInfo: TribeInfo = {
          name: community.village_name,
          population: community.population,
          country: community.province,
          city: community.district,
          community: community.village_name,
        };
        handleMarkerClick(tribeInfo);
      });

      markersRef.current.push(marker);
    });

    if (filteredData.length > 0) {
      const padding = 50;
      let bounds: LngLatBoundsLike = [
        [-180, -90],
        [180, 90],
      ];

      if (filteredData.length === 2) {
        const lng = filteredData[0].longitude;
        const lat = filteredData[0].latitude;
        if (typeof lng === "number" && typeof lat === "number") {
          const offset = 0.1;
          bounds = [
            [lng - offset, lat - offset],
            [lng + offset, lat + offset],
          ];
        }
      } else if (filteredData.length > 2) {
        bounds = filteredData.reduce(
          ([west, south, east, north], { longitude, latitude }) => {
            if (longitude !== null && latitude !== null) {
              return [
                Math.min(west, longitude),
                Math.min(south, latitude),
                Math.max(east, longitude),
                Math.max(north, latitude),
              ];
            }
            return [west, south, east, north];
          },
          [180, 90, -180, -90]
        );
      }
      mapRef.current.fitBounds(bounds, { padding });
    }
  }, [communitiesData, searchTerm, darkMode]);

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
    <div className="relative w-full h-full">
      <div className="absolute inset-0" ref={mapContainerRef} />
      <form
        onSubmit={handleSearch}
        className="absolute top-10 left-10 bg-white p-5 rounded shadow-md"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a community..."
          className="w-64 text-black"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Search
        </button>
        <button
          type="button"
          onClick={clearSearch}
          className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default InteractiveGlobe;
