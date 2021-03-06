#!/bin/bash

# Go to input directory to retrieve necessary files
mkdir input
cd input

# Add Hurricane Sandy Radii data to Postgis w/ GIST index
curl https://www.nhc.noaa.gov/gis/best_track/al182012_best_track.zip --output al182012_best_track.zip
mkdir al182012_best_track
unzip al182012_best_track.zip -d al182012_best_track
shp2pgsql al182012_best_track/al182012_radii.shp public.al182012_radii| psql -d gis_db
psql -d gis_db -c "CREATE INDEX al182012_radii_geom_gix ON public.al182012_radii USING GIST (geom)"

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
