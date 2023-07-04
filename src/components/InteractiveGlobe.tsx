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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || !communitiesData.length) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmFydWNoLWsiLCJhIjoiY2xpdDM3dnJqMGwxMDNobzc3emJtYndlaiJ9.mLMAW4ATqzmqjYW49Quo9Q";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0] as LngLatLike,
      zoom: 1,
      maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !communitiesData.length) return;

    const filteredData = communitiesData.filter((community) =>
      community.village_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const bounds = filteredData.reduce(
      (acc: LngLatBoundsLike, community) => {
        if (
          community.longitude !== null &&
          community.latitude !== null &&
          typeof community.longitude === "number" &&
          typeof community.latitude === "number"
        ) {
          const [minLng, minLat, maxLng, maxLat] = acc;
          const { longitude, latitude } = community;
          return [
            Math.min(minLng, longitude),
            Math.min(minLat, latitude),
            Math.max(maxLng, longitude),
            Math.max(maxLat, latitude),
          ];
        }
        return acc;
      },
      [-180, -90, 180, 90] as LngLatBoundsLike
    );

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: bounds,
      zoom: 9,
      maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
    });

    filteredData.forEach((community) => {
      if (
        community.longitude !== null &&
        community.latitude !== null &&
        typeof community.longitude === "number" &&
        typeof community.latitude === "number"
      ) {
        const markerEl = document.createElement("div");
        markerEl.className = "marker";
        Object.assign(markerEl.style, markerStyle);

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          className: darkMode ? "dark-mode-popup text-black" : "",
        }).setHTML(
          `<h3 class="${darkMode ? "text-green-500" : ""}">${
            community.village_name
          }</h3>`
        );

        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([
            community.longitude as number,
            community.latitude as number,
          ])
          .setPopup(popup)
          .addTo(map);

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
      }
    });
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
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default InteractiveGlobe;
