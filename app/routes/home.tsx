import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import getCountryData from "../scripts/getCountryData";

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
    <div>
      <h1>{data.name.common}</h1>
      <img src={data.flags.png} alt={`${data.name.common} flag`} width={150} />
      <p>Capital: {data.capital?.[0]}</p>
      <p>Population: {data.population.toLocaleString()}</p>
      <p>Region: {data.region}</p>
    </div>
  );
}
