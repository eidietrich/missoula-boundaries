#!/bin/bash

# Run from repo home directory
# sh scripts/mt-house-districts.sh
# Human-readable source page: http://leg.mt.gov/css/Committees/interim/2011-2012/districting/adopted-plan.asp

# TODO: Make this more generalized

DATASOURCE="http://ftp.geoinfo.msl.mt.gov/Data/Spatial/MSDI/AdministrativeBoundaries/MontanaSchoolDistricts_shp.zip"

mkdir -p raw-data/mt-school-districts
cd raw-data/mt-school-districts

# Download data
curl -o shapefile.zip $DATASOURCE
unzip shapefile.zip


# data processing
# Documentation: https://github.com/mbloch/mapshaper/wiki/Command-Reference
# -each line strips unneeded properties and builds id label

mapshaper \
    -i montanaschooldistricts_shp/Elementary.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"], type: "elem"}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

mapshaper \
    -i montanaschooldistricts_shp/Secondary.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"], type: "hs"}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

mapshaper \
    -i montanaschooldistricts_shp/Unified.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"], type: "k12"}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

# Combined districts
mapshaper \
    -i Secondary.geojson Unified.geojson \
    merge-files \
    -o mt-hs-districts.geojson

mapshaper \
    -i Elementary.geojson Unified.geojson \
    merge-files \
    -o mt-elem-districts.geojson

# move to app folder

cp mt-elem-districts.geojson ./../../app/geodata/mt-elem-districts.geojson
cp mt-hs-districts.geojson ./../../app/geodata/mt-hs-districts.geojson

echo "DONE"

