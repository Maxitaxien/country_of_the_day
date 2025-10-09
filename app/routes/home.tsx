import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import getCountryData from "../scripts/getCountryData";
import GlobeView from "../components/globeView";
import { Container } from "@mantine/core";
import { CountryMenu } from "../components/menu";

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
      <CountryMenu />
      {/* Text box*/}
      <Container className="relative pt-12 flex flex-col items-center">
        <h1 className="text-7xl text-white text-shadow-md">
          The country of the day is
        </h1>
        <div className="flex items-center gap-6 mt-4">
          <h1 className="text-9xl font-extrabold text-white [text-shadow:_0_0_5px_#00ffff,_0_0_15px_#00ffff,_0_0_30px_#00ffff]">
            {data.name.common}
          </h1>
          <img
            src={data.flags.png}
            alt={`${data.name.common} flag`}
            width={150}
            className="rounded-lg shadow-lg"
          />
        </div>
      </Container>
      {/* Info Box */}
      <Container className="flex flex-col items-center">
        <p>Capital: {data.capital?.[0]}</p>
        <p>Population: {data.population.toLocaleString()}</p>
        <p>Region: {data.region}</p>
      </Container>
      {/* Globe  + info*/}
      <div className="flex flex-col w-full min-h-[100vh]">
        <div className="flex-grow-[3] w-full relative">
          <GlobeView width="100%" height="100%" />
        </div>
        <div className="flex-grow w-full bg-gray-900 text-white p-8">
          <h2 className="text-3xl font-bold mb-4">Neighbouring Countries</h2>
          <ul className="list-disc list-inside">
            {data.borders?.map((border: any) => (
              <li key={border}>{border}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
