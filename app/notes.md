https://restcountries.com/v3.1/name/{country}
https://en.wikipedia.org/api/rest_v1/page/summary/{country}

use supabase and store data instead of download each time
Add like this:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-or-anon-key

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

create table capitals (
id serial primary key,
country text unique not null,
capital text
);

const capitals: Record<string, string> = {
Norway: "Oslo",
Sweden: "Stockholm",
Finland: "Helsinki"
};

import { readFile } from "fs/promises";

async function uploadFromFile() {
  const jsonText = await readFile("./public/data/capitals.json", "utf-8");
  const capitals = JSON.parse(jsonText) as Record<string, string>;

  const rows = Object.entries(capitals).map(([country, capital]) => ({
    country,
    capital
  }));

  const { error } = await supabase.from("capitals").upsert(rows);

  if (error) console.error("Upload failed:", error);
  else console.log("✅ Upload complete!");
}

await uploadFromFile();

await uploadCapitals();

Used for generating borders
https://geojson-maps.kyd.au/

Used for map
https://geojson.io/

- Implement zoomin to either capital or country.
- Make globe view take country as argument.

- Cities within country?
  Use this dataset/api with a script to extract say top 5 (or less if none exist) cities within a country
  https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/table/?flg=en-us&disjunctive.cou_name_en&sort=name&q=Norway

Can filter based on population, and extract coordinates for mapping purposes.

Bordering countries?

Check if lat and lon are double or int
