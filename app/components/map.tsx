import React, { useEffect, useRef } from "react";
import loadJson from "../scripts/loadJsonFile";

const GlobeView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const capitals = await loadJson("/data/capitals.geojson");
      const countries = await loadJson("/data/countries.geojson");

      const capitalFeatures = capitals.features;
      const countryFeatures = countries.features;

      const norway = countryFeatures.find(
        (f: any) => f.properties.name === "Norway"
      );

      const Globe = (await import("globe.gl")).default; // dynamic import
      const globe = (Globe as any)()
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
        .pointsData(
          capitalFeatures.map((f: any) => ({
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            name: f.properties.city,
            isSelected: f.properties.city === "Oslo",
          }))
        )
        .pointColor((p: any) => (p.isSelected ? "red" : "yellow"))
        .pointAltitude(0.05)
        .pointLabel("name")
        .polygonsData(countryFeatures)
        .polygonSideColor(() => "rgba(0,150,255,0.2)")
        .polygonCapColor((feat: any) =>
          feat.properties.name === "Norway" ? "red" : "rgba(0,150,255,0.4)"
        )
        .polygonAltitude((feat: any) =>
          feat.properties.name === "Norway" ? 0.03 : 0.005
        )
        .polygonsTransitionDuration(500);

      globe(containerRef.current);
    })();

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default GlobeView;
