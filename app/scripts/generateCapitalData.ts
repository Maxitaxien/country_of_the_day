import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const countryToCapital: Record<string, string> = {};

// Only used for generating backend data
export async function generateData() {
  const path = join(__dirname, '../../public', 'data/capitals.geojson');
  const data = await readFile(path, 'utf-8');
  const json = JSON.parse(data);
  const features = json['features'];
  for (const feature of features) {
    const props = feature.properties;
    if (props.country && props.city) {
        const country = props.country.replace("/&amp;g", "&");
        const city = props.city.replace("/&amp;/g", "&");

        countryToCapital[country] = city;
    }
  }

  const savepath = join(__dirname, '../../public', 'data/countryToCapital.json');
  const jsonData = JSON.stringify(countryToCapital, null, 2);
  await writeFile(savepath, jsonData, 'utf-8');
}

await generateData();