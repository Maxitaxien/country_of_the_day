import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import getCountryData from "../scripts/getCountryData";
import GlobeView from "../components/globeView";
import { Container } from "@mantine/core";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const data = await getCountryData("Norway");
  return data;
}

export default function Home() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="relative min-h-screen">
      <Container className="relative z-10 pt-48 flex flex-col items-center">
                <h1 className="text-7xl text-white text-shadow-md">The country of the day is</h1>
                <h1 className="text-9xl font-extrabold text-white [text-shadow:_0_0_5px_#00ffff,_0_0_15px_#00ffff,_0_0_30px_#00ffff]">{data.name.common}</h1>
      </Container>
            <img src={data.flags.png} alt={`${data.name.common} flag`} width={150} />
          <p>Capital: {data.capital?.[0]}</p>
          <p>Population: {data.population.toLocaleString()}</p>
          <p>Region: {data.region}</p>
    <div className="z-0 w-[60vw] h-[60vh] mt-10">
      <GlobeView width="100%" height="100%" />
    </div>
    </div>
  );
}
