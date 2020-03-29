#!/bin/bash

createdb gis_db
psql -d gis_db -c "CREATE EXTENSION postgis"

# Go to input directory to retrieve necessary files
cd input

# Add US County data to Postgis w/ GIST index
curl https://www2.census.gov/geo/tiger/TIGER2019/COUNTY/tl_2019_us_county.zip --output tl_2019_us_county.zip
wget https://www2.census.gov/geo/tiger/TIGER2019/COUNTY/tl_2019_us_county.zip
unzip tl_2019_us_county.zip
shp2pgsql tl_2019_us_county/tl_2019_us_county.shp public.tl_2019_us_county | psql -d gis_db
psql -d gis_db -c "CREATE INDEX tl_2019_us_county_geom_gix ON public.tl_2019_us_county USING GIST (geom)"

# Add Hurricane Sandy Radii data to Postgis w/ GIST index
curl https://www.nhc.noaa.gov/gis/best_track/al182012_best_track.zip --output al182012_best_track.zip
unzip al182012_best_track.zip
shp2pgsql al182012_best_track/al182012_radii.shp public.al182012_radii| psql -d gis_db
psql -d gis_db -c "CREATE INDEX al182012_radii_geom_gix ON public.al182012_radii USING GIST (geom)"

# Add Hurricane Sandy Windswath data to Postgis w/ GIST index
curl https://www.nhc.noaa.gov/gis/best_track/al182012_best_track.zip --output al182012_best_track.zip
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
                        SELECT r.radii,
                               r.synoptime,
                               r.basin,
                               r.stormnum,
                               r.ne,
                               r.se,
                               r.sw,
                               r.nw,
                               r.gid AS id,
                               c.geoid AS fips
                    ) As l)) As properties
            FROM public.tl_2019_us_county as c, public.al182012_radii as r
            WHERE ST_Intersects(c.geom, ST_MakeValid(r.geom))
        ) f
    ) fc
) TO './output/hurricane-sandy-affected-counties-over-time.json'"

# Get windspeed data as GeoJSON
psql -d gis_db -c "COPY (
    SELECT row_to_json(fc) AS json_out FROM (
        SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
        FROM (
            SELECT 'Feature' As type,
                   ST_AsGeoJSON(r.geom)::json As geometry,
                   ROW_TO_JSON((
                    SELECT l FROM (
                        SELECT r.gid AS id,
                               r.radii,
                               r.synoptime,
                               r.basin,
                               r.stormnum,
                               r.ne,
                               r.se,
                               r.sw,
                               r.nw
                    ) As l)) As properties
            FROM public.al182012_radii as r
        ) f
    ) fc
) TO './output/al182012_radii.json'"
