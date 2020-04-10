#!/bin/bash

# Go to input directory to retrieve necessary files
mkdir input
cd input

# Add US County data to Postgis w/ GIST index
curl https://www2.census.gov/geo/tiger/TIGER2019/COUNTY/tl_2019_us_county.zip --output tl_2019_us_county.zip
mkdir tl_2019_us_county
unzip tl_2019_us_county.zip -d tl_2019_us_county
shp2pgsql tl_2019_us_county/tl_2019_us_county.shp public.tl_2019_us_county | psql -d gis_db
psql -d gis_db -c "CREATE INDEX tl_2019_us_county_geom_gix ON public.tl_2019_us_county USING GIST (geom)"
