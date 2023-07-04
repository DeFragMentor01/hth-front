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

    mapboxgl.accessToken = "...";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0] as LngLatLike,
      zoom: 1,
      maxBounds: [-180, -90, 180, 90] as LngLatBoundsLike,
    });

    map.on("load", () => {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true.
      map.addSource("villages", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: {
          type: "FeatureCollection",
          features: communitiesData.map(community => ({
            type: "Feature",
            properties: { village_name: community.village_name, population: community.population },
            geometry: {
              type: "Point",
              coordinates: [community.longitude, community.latitude],
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
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
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
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

      // inspect a cluster on click
      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('villages').getClusterExpansionZoom(
          clusterId,
          function (err, zoom) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on('click', 'unclustered-point', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var { village_name, population } = e.features[0].properties;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `Village: ${village_name}<br/>Population: ${population}`
          )
          .addTo(map);
      });

      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
      });
    });
    
    const filteredData = communitiesData
      .filter((community) =>
        community.village_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((community) => community.longitude !== null && community.latitude !== null);

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
          const offset = 0.05; // Adjust the offset value to a smaller value
          bounds = [
            [lng - offset, lat - offset],
            [lng + offset, lat + offset],
          ];
          console.log("fitBounds single", bounds);
        }
      } else {
        const lats = filteredData.map((community) => community.latitude as number);
        const lngs = filteredData.map((community) => community.longitude as number);
        bounds = [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ];
        console.log("fitBounds multiple", bounds);
      }
    
      map.fitBounds(bounds as mapboxgl.LngLatBoundsLike, { padding });
    } else {
      const worldBounds: LngLatBoundsLike = [
        [-180, -90],
        [180, 90],
      ];
      console.log("fitBounds world", worldBounds);
      map.fitBounds(worldBounds as mapboxgl.LngLatBoundsLike);
    }
    
    
    

    return () => {
      if (currentPopup) {
        currentPopup.remove();
      }
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
