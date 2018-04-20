#!/bin/bash

# Run from repo home directory
# sh scripts/mt-schools-district-geography-msl-source.sh

# USING THIS SCRIPT (tuns out census geography doesn't have the code you need to join with enrollment data)

DATASOURCE="http://ftp.geoinfo.msl.mt.gov/Data/Spatial/MSDI/AdministrativeBoundaries/MontanaSchoolDistricts_shp.zip"
FOLDER="mt-schools-district-geography-msl"

mkdir -p raw-data/$FOLDER
cd raw-data/$FOLDER

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
    -each 'this.properties = {id: this.properties["NAME"], type: "elem", le_code: this.properties["LE_NUMBER"]}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

mapshaper \
    -i montanaschooldistricts_shp/Secondary.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"], type: "hs", le_code: this.properties["LE_NUMBER"] }' \
    -proj wgs84 \
    -o format=geojson extension=".geojson"

mapshaper \
    -i montanaschooldistricts_shp/Unified.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"], type: "k12", le_code: this.properties["LE_NUMBER"]}' \
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

