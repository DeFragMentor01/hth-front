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

 useEffect(() => {
  if (!mapContainerRef.current || !communitiesData.length) return;

  mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFydWNoLWsiLCJhIjoiY2xpdDM3dnJqMGwxMDNobzc3emJtYndlaiJ9.mLMAW4ATqzmqjYW49Quo9Q";

  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/mapbox/streets-v12",
    center: [0, 0] as LngLatLike,
    zoom: 1,
    maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
  });

  map.on("load", function () {
    map.addSource("villages", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: communitiesData
          .filter(
            (community) =>
              typeof community.longitude === "number" &&
              typeof community.latitude === "number"
          )
          .map((community) => {
            const coordinates: [number, number] = [
              community.longitude || 0,
              community.latitude || 0,
            ];
            return {
              type: "Feature",
              properties: {
                village_name: community.village_name,
                population: community.population,
              },
              geometry: {
                type: "Point",
                coordinates: coordinates,
              },
            };
          }),
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "villages",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "villages",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "villages",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

map.on("click", "clusters", function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ["clusters"],
  });

  if (features.length > 0 && features[0]?.properties?.cluster_id) {
    var clusterId = features[0].properties.cluster_id;
    map.getSource("villages").getClusterExpansionZoom(clusterId, function (
      err,
      zoom
    ) {
      if (err) return;

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
  }
});

    
    map.on("click", "unclustered-point", function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var village_name = e.features[0].properties.village_name;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`Village: ${village_name}`)
        .addTo(map);
    });

    map.on("mouseenter", "clusters", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "clusters", function () {
      map.getCanvas().style.cursor = "";
    });

    if (currentPopup) {
      currentPopup.remove();
    }
  });

  return () => {
    map.remove();
  };
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
              onClick={clearSearch}
              className="text-gray-500 bg-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center"
            >
              ❌
            </button>
          </div>
        )}
      </form>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default InteractiveGlobe;
