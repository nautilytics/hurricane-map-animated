#!/bin/bash

createdb gis_db
psql -d gis_db -c "CREATE EXTENSION postgis"
