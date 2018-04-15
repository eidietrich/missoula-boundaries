#!/bin/bash

# Run from repo home directory
# sh scripts/mt-places.sh

# TODO: Make this more generalized

# DATASOURCE="https://www2.census.gov/geo/tiger/GENZ2017/shp/cb_2017_30_place_500k.zip"

mkdir -p raw-data/mt-places
cd raw-data/mt-places

# # Download data
# curl -o shapefile.zip $DATASOURCE
# unzip shapefile.zip

# # convert everything to lowercase
# # Ref: https://stackoverflow.com/questions/7787029/how-do-i-rename-all-files-to-lowercase
# for f in *; do mv "$f" "$f.tmp"; mv "$f.tmp" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done

# data processing
# Documentation: https://github.com/mbloch/mapshaper/wiki/Command-Reference
# -each line strips unneeded properties and builds id label
# -explode converts MULTIPOLYGONS to POLYGON objects (app expects POLYGON)
mapshaper \
    -i cb_2017_30_place_500k.shp \
    -explode \
    -each 'this.properties = {id: this.properties["NAME"], type: this.properties["LSAD"].replace("00","consolidated city/county").replace("25","city").replace("43","town").replace("57","census place")}' \
    -o format=geojson extension=".geojson"

# move to app folder
cp ./cb_2017_30_place_500k.geojson ./../../app/geodata/mt-places.geojson

echo "DONE"

