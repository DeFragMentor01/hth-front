import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [bounds, setBounds] = useState<LngLatBoundsLike | null>(null);

  const mapRef = useRef<mapboxgl.Map | null>(null);

  const filteredData = useMemo(
    () =>
      communitiesData
        .filter((community) =>
          community.village_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(
          (community) =>
            community.longitude !== null && community.latitude !== null
        ),
    [communitiesData, searchTerm]
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmFydWNoLWsiLCJhIjoiY2xpdDM3dnJqMGwxMDNobzc3emJtYndlaiJ9.mLMAW4ATqzmqjYW49Quo9Q";

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0] as LngLatLike,
        zoom: 1,
        maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
      });
    }

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
        .addTo(mapRef.current);

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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [bounds]);

  useEffect(() => {
    if (filteredData.length > 0) {
      let newBounds: LngLatBoundsLike = [
        [-180, -90],
        [180, 90],
      ];

      if (filteredData.length === 2) {
        const lng = filteredData[0].longitude;
        const lat = filteredData[0].latitude;
        if (typeof lng === "number" && typeof lat === "number") {
          const offset = 0.05;
          newBounds = [
            [lng - offset, lat - offset],
            [lng + offset, lat + offset],
          ];
        }
      } else {
        const lats = filteredData.map((community) => community.latitude as number);
        const lngs = filteredData.map((community) => community.longitude as number);
        newBounds = [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ];
      }

      setBounds(newBounds);
    } else {
      setBounds([
        [-180, -90],
        [180, 90],
      ]);
    }
  }, [filteredData]);

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
      <form
        onSubmit={handleSearch}
        className="absolute top-0 z-10 w-full flex justify-center p-4"
      >
        <div className="flex items-center w-3/5 bg-white bg-opacity-60 rounded-full shadow-xl">
          <input
            type="text"
            placeholder="Find a village..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="rounded-l-full w-full py-2 px-4 text-gray-700 bg-transparent leading-tight focus:outline-none"
          />
          <div className="p-2">
            <button
              type="submit"
              className="text-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center"
            >
              🔍
            </button>
          </div>
        </div>
        {searchInput && (
          <div className="ml-4">
            <button
              type="button"
              className="text-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center"
              onClick={clearSearch}
            >
              ❌
            </button>
          </div>
        )}
      </form>
      <div className="h-full" ref={mapContainerRef} />
    </div>
  );
};

export default InteractiveGlobe;
