#!/bin/bash

# Run from repo home directory
# sh scripts/mt-house-districts-geography.sh

# TODO: Make this more generalized

DATASOURCE="http://leg.mt.gov/content/Committees/Interim/2011-2012/Districting/Maps/Adopted-Plan/Senate_shape_adopted021213.zip"

mkdir -p raw-data/mt-senate-districts
cd raw-data/mt-senate-districts

# Download data
curl -o shapefile.zip $DATASOURCE
unzip shapefile.zip

# convert everything to lowercase
# Ref: https://stackoverflow.com/questions/7787029/how-do-i-rename-all-files-to-lowercase
for f in *; do mv "$f" "$f.tmp"; mv "$f.tmp" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done

# data processing
# Documentation: https://github.com/mbloch/mapshaper/wiki/Command-Reference
# -each line strips unneeded properties and builds id label
mapshaper \
    -i senate_shape_adopted021213.shp \
    -simplify dp 20% \
    -each 'this.properties = {id: "Senate District " + this.properties["DISTRICT"]}' \
    -o format=geojson extension=".geojson"

# move to app folder

cp ./senate_shape_adopted021213.geojson ./../../app/geodata/mt-senate-districts.geojson

echo "DONE"

