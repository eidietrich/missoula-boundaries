#!/bin/bash

# Run from repo home directory
# sh scripts/mt-schools-district-geography.sh

# Changing this to use census geography instead of MT State Library products to make joining with census data easier

FOLDER='mt-schools-district-geography-census'

ELEM_DATASOURCE='ftp://ftp2.census.gov/geo/tiger/TIGER2017/ELSD/tl_2017_30_elsd.zip'
HS_DATASOURCE='ftp://ftp2.census.gov/geo/tiger/TIGER2017/SCSD/tl_2017_30_scsd.zip'
K12_DATASOURCE='ftp://ftp2.census.gov/geo/tiger/TIGER2017/UNSD/tl_2017_30_unsd.zip'

mkdir -p raw-data/$FOLDER
cd raw-data/$FOLDER

# Download data
curl -o elem_shapefile.zip $ELEM_DATASOURCE
curl -o hs_shapefile.zip $HS_DATASOURCE
curl -o k12_shapefile.zip $K12_DATASOURCE

unzip elem_shapefile.zip
unzip hs_shapefile.zip
unzip k12_shapefile.zip


# data processing
# Documentation: https://github.com/mbloch/mapshaper/wiki/Command-Reference
# -each line strips unneeded properties and builds id label

# NB - Below here hasn't been adapted

# mapshaper \
#     -i tl_2017_30_elsd.shp \
#     -simplify dp 10% \
#     -clean \
#     -each 'this.properties = {id: this.properties["NAME"], type: "elem"}' \
#     -proj wgs84 \
#     -o format=geojson extension=".geojson"

# mapshaper \
#     -i tl_2017_30_scsd.shp \
#     -simplify dp 10% \
#     -clean \
#     -each 'this.properties = {id: this.properties["NAME"], type: "hs"}' \
#     -proj wgs84 \
#     -o format=geojson extension=".geojson"

# mapshaper \
#     -i tl_2017_30_unsd.shp \
#     -simplify dp 10% \
#     -clean \
#     -each 'this.properties = {id: this.properties["NAME"], type: "k12"}' \
#     -proj wgs84 \
#     -o format=geojson extension=".geojson"

# # Combined districts
# mapshaper \
#     -i Secondary.geojson Unified.geojson \
#     merge-files \
#     -o mt-hs-districts.geojson

# mapshaper \
#     -i Elementary.geojson Unified.geojson \
#     merge-files \
#     -o mt-elem-districts.geojson

# # move to app folder

# cp mt-elem-districts.geojson ./../../app/geodata/mt-elem-districts.geojson
# cp mt-hs-districts.geojson ./../../app/geodata/mt-hs-districts.geojson

echo "DONE"

