import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { getCountryData, getRandomCountryName } from "../scripts/getCountry";
import GlobeView from "../components/globeView";
import { Container } from "@mantine/core";
import { CountryMenu } from "../components/menu";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const selected = url.searchParams.get("country") ?? getRandomCountryName();
  const countries = ["Norway", "Russia", "Japan"];
  const countryData = await getCountryData(selected);
  return { countryName: selected, countryData, countries };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Country of the day" }];
  const name =
    data.countryName ?? data.countryData?.name?.common ?? "Country of the day";
  return [
    { title: `Country of the day: ${name}` },
    { name: "description", content: `Learn about ${name}` },
  ];
}

export default function Home() {
  // destructure loader
  const { countryData, countries, countryName } =
    useLoaderData<typeof loader>();

  return (
    <div className="relative min-h-screen">
      <CountryMenu countries={countries} selected={countryName} />
      {/* Text box*/}
      <Container className="relative pt-12 flex flex-col items-center">
        <h1 className="text-7xl text-white text-shadow-md">
          The country of the day is
        </h1>
        <div className="flex items-center gap-6 mt-4">
          <h1 className="text-9xl font-extrabold text-white [text-shadow:_0_0_5px_#00ffff,_0_0_15px_#00ffff,_0_0_30px_#00ffff]">
            {countryData.name.common}
          </h1>
          <img
            src={countryData.flags.png}
            alt={`${countryData.name.common} flag`}
            width={150}
            className="rounded-lg shadow-lg"
          />
        </div>
      </Container>
      {/* Info Box */}
      <Container className="flex flex-col items-center">
        <p>Capital: {countryData.capital?.[0]}</p>
        <p>Population: {countryData.population.toLocaleString()}</p>
        <p>Region: {countryData.region}</p>
      </Container>
      {/* Globe  + info*/}
      <div className="flex flex-col lg:flex-row w-full min-h-[100vh]">
        <div className="lg:flex-[2] h-[50vh] lg:h-auto relative min-w-0">
          <GlobeView width="100%" height="100%" countryName={countryName} />
        </div>
        {/* Info box beside it */}
        <div className="flex-[1] flex flex-col justify-center p-8 bg-gray-900">
          <h2 className="text-3xl font-bold mb-4">
            Facts about {countryData.name.common}
          </h2>
          <p>Capital: {countryData.capital?.[0]}</p>
          <p>Population: {countryData.population.toLocaleString()}</p>
          <p>Region: {countryData.region}</p>
          {countryData.borders && (
            <>
              <h3 className="text-2xl font-semibold mt-6 mb-2">Neighbours:</h3>
              <ul className="list-disc list-inside">
                {countryData.borders.map((border: any) => (
                  <li key={border}>{border}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
