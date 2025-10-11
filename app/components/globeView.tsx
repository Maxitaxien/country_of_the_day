import React, { useEffect, useRef, useState } from "react";
import loadJson from "../scripts/loadJsonFile";

let GlobeLib: any = null; // cache it between renders

async function loadGlobeLib() {
  if (!GlobeLib) {
    const mod = await import("globe.gl");
    GlobeLib = mod.default;
  }
  return GlobeLib;
}

async function createGlobe(
  containerRef: React.RefObject<HTMLDivElement | null>,
  countryData: any,
  capitalData: any
) {
  const lat = capitalData.geometry.coordinates[1];
  const lng = capitalData.geometry.coordinates[0];

  const Globe = await loadGlobeLib();
  const globe = (Globe as any)()
    .globeImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    )
    .pointsData([
      {
        lat,
        lng,
        name: capitalData.properties.city,
        color: "#FFD700",
      },
    ])
    .pointColor("color")
    .pointAltitude(0.05)
    .pointLabel("name")
    .polygonsData([countryData])
    .polygonSideColor(() => "rgba(200,0,0,0.5)")
    .polygonCapColor(() => "rgba(255,0,0,0.3)")
    .polygonAltitude(0.02)
    .polygonsTransitionDuration(500);

  globe(containerRef.current);

  globe.pointOfView({ lat, lng, altitude: 1.5 }, 1000); // zoom to capital

  // limit zoom
  const controls = globe.controls();
  controls.minDistance = 130;
  controls.maxDistance = 400;

  return globe;
}

const GlobeView: React.FC<{
  width?: string;
  height?: string;
  countryName: string;
}> = ({ width = "100%", height = "100vh", countryName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const hasMounted = useRef(false);

  const [capitals, setCapitals] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const capitalsJson = await loadJson("/data/capitals.geojson");
      const countriesJson = await loadJson("/data/countries.geojson");
      setCapitals(capitalsJson.features);
      setCountries(countriesJson.features);
      setDataLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!dataLoaded || !containerRef.current) return;

    const capitalName = "Moscow";
    const countryData = countries.find(
      (f: any) => f.properties.name === countryName
    );
    const capitalData = capitals.find(
      (f: any) => f.properties.city === capitalName
    );

    if (!countryData || !capitalData) return;

    if (!hasMounted.current) {
      hasMounted.current = true;

      (async () => {
        const globe = await createGlobe(containerRef, countryData, capitalData);
        globeRef.current = globe;

        const handleResize = () => {
          if (!containerRef.current) return;
          globe.width(containerRef.current.offsetWidth);
          globe.height(containerRef.current.offsetHeight);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
      })();
    } else {
      if (globeRef.current) {
        const lat = capitalData.geometry.coordinates[1];
        const lng = capitalData.geometry.coordinates[0];
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
        globeRef.current.pointsData([
          {
            lat,
            lng,
            name: capitalData.properties.city,
            color: "#FFD700",
          },
        ]);
        globeRef.current.polygonsData([countryData]);
      }
    }
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [countryName, dataLoaded]);

  return (
    <div ref={containerRef} style={{ width, height, overflow: "hidden" }} />
  );
};

export default GlobeView;
