https://restcountries.com/v3.1/name/{country}
https://en.wikipedia.org/api/rest_v1/page/summary/{country}

use supabase and store data instead of download each time

Used for generating borders
https://geojson-maps.kyd.au/

Used for map
https://geojson.io/

If performance is poor, only generate polygon for relevant country. Then zoom in to it and make it impossible to move globe.

- Implement zoomin to either capital or country.
- Make globe view take country as argument.
