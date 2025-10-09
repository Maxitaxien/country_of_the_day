https://restcountries.com/v3.1/name/{country}
https://en.wikipedia.org/api/rest_v1/page/summary/{country}

use supabase and store data instead of download each time

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
