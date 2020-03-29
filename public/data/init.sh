#!/bin/bash

createdb gis_db
psql -d gis_db -c "CREATE EXTENSION postgis"

# Go to input directory to retrieve necessary files
cd input

# Add US County data to Postgis w/ GIST index
wget https://www2.census.gov/geo/tiger/TIGER2019/COUNTY/tl_2019_us_county.zip
unzip tl_2019_us_county.zip
shp2pgsql tl_2019_us_county/tl_2019_us_county.shp public.tl_2019_us_county | psql -d gis_db
psql -d gis_db -c "CREATE INDEX tl_2019_us_county_geom_gix ON public.tl_2019_us_county USING GIST (geom)"

# Add Hurricane Sandy Windswath data to Postgis w/ GIST index
wget https://www.nhc.noaa.gov/gis/best_track/al182012_best_track.zip
unzip al182012_best_track.zip
shp2pgsql al182012_best_track/al182012_windswath.shp public.al182012_windswath | psql -d gis_db
psql -d gis_db -c "CREATE INDEX al182012_windswath_geom_gix ON public.al182012_windswath USING GIST (geom)"

# Get affected counties with date and windspeed data as GeoJSON
psql -d gis_db -c "COPY (
    SELECT row_to_json(fc) AS json_out FROM (
        SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
        FROM (
            SELECT 'Feature' As type,
                   ST_AsGeoJSON(c.geom)::json As geometry,
                   ROW_TO_JSON((
                    SELECT l FROM (
                        SELECT ws.radii,
                               ws.startdtg,
                               ws.enddtg,
                               ws.basin,
                               ws.stormnum,
                               c.geoid AS fips
                    ) As l)) As properties
            FROM public.tl_2019_us_county as c, public.al182012_windswath as ws
            WHERE ST_Intersects(c.geom, ws.geom)
        ) f
    ) fc
) TO './output/hurricane-sandy-affected-counties.json'"

# Get windspeed data as GeoJSON
psql -d gis_db -c "COPY (
    SELECT row_to_json(fc) AS json_out FROM (
        SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
        FROM (
            SELECT 'Feature' As type,
                   ST_AsGeoJSON(ws.geom)::json As geometry,
                   ROW_TO_JSON((
                    SELECT l FROM (
                        SELECT ws.radii,
                               ws.gid AS id,
                               ws.startdtg,
                               ws.enddtg,
                               ws.basin,
                               ws.stormnum
                    ) As l)) As properties
            FROM public.al182012_windswath as ws
        ) f
    ) fc
) TO './output/al182012_windswath.json'"
