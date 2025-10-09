import React, { useEffect, useRef } from "react";
import loadJson from "../scripts/loadJsonFile";

const GlobeView: React.FC<{ width?: string; height?: string}> = ({
  width = "100%",
  height = "100vh",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const capitals = await loadJson("/data/capitals.geojson");
      const countries = await loadJson("/data/countries.geojson");

      const capitalFeatures = capitals.features;
      const countryFeatures = countries.features;

      const countryName = "Norway"; // TODO: Parameterize, get randomized
      const capitalName = "Oslo"; // TODO: Lookup in DB based on name

      // TODO: Database lookup
      const countryData = countryFeatures.find(
        (f: any) => f.properties.name === countryName
      );

      const capitalData = capitalFeatures.find(
        (f: any) => f.properties.city === capitalName
      );

      const lat = capitalData.geometry.coordinates[1];
      const lng = capitalData.geometry.coordinates[0];

      const Globe = (await import("globe.gl")).default; // dynamic import
      const globe = (Globe as any)()
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .pointsData(
          capitalFeatures.map((f: any) => ({
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            name: f.properties.city,
            isSelected: f.properties.city === capitalName,
          }))
        )
        .pointColor((p: any) => (p.isSelected ? "green" : "yellow"))
        .pointAltitude(0.05)
        .pointLabel("name")
        .polygonsData([countryData])
        .polygonSideColor(() => "rgba(0,150,255,0.2)")
        .polygonCapColor((feat: any) =>
          feat.properties.name === countryName ? "red" : "rgba(0,150,255,0.4)"
        )
        .polygonAltitude(0.02)
        .polygonsTransitionDuration(500);

      globe(containerRef.current);

      globe.pointOfView({ lat, lng, altitude: 1.5 }, 1000); // zoom to capital
      
      // limit user-interaction to around the country
      const controls = globe.controls();

      // can't move too far from capital/country
      const targetLatRad = (90 - lat) * (Math.PI / 180); // convert to radians from pole
      controls.minPolarAngle = targetLatRad - Math.PI / 10; // allow small tilt up/down
      controls.maxPolarAngle = targetLatRad + Math.PI / 10;

      controls.minAzimuthAngle = -Math.PI / 6; // about -30 degrees
      controls.maxAzimuthAngle =  Math.PI / 6; // about +30 degrees

      controls.minDistance = 120; 
      controls.maxDistance = 400;
        
    })();

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} style={{ width, height} } />;
};

export default GlobeView;
