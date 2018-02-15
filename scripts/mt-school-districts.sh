#!/bin/bash

# Run from repo home directory
# sh scripts/mt-house-districts.sh
# Human-readable source page: http://leg.mt.gov/css/Committees/interim/2011-2012/districting/adopted-plan.asp

# TODO: Make this more generalized

# DATASOURCE="http://ftp.geoinfo.msl.mt.gov/Data/Spatial/MSDI/AdministrativeBoundaries/MontanaSchoolDistricts_shp.zip"

mkdir -p raw-data/mt-school-districts
cd raw-data/mt-school-districts

# # Download data
# curl -o shapefile.zip $DATASOURCE
# unzip shapefile.zip


# data processing
# Documentation: https://github.com/mbloch/mapshaper/wiki/Command-Reference
# -each line strips unneeded properties and builds id label

mapshaper \
    -i montanaschooldistricts_shp/Elementary.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"]}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

mapshaper \
    -i montanaschooldistricts_shp/Secondary.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"]}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

mapshaper \
    -i montanaschooldistricts_shp/Unified.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"]}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

# move to app folder

cp Elementary.geojson ./../../app/geodata/mt-elem-districts.geojson
cp Secondary.geojson ./../../app/geodata/mt-hs-districts.geojson
cp Unified.geojson ./../../app/geodata/mt-k12-districts.geojson

echo "DONE"

