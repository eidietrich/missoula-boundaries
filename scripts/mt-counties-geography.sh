#!/bin/bash

# Run from repo home directory
# sh scripts/mt-counties-geography.sh

# TODO: Make this more generalized

DATASOURCE="http://ftp.geoinfo.msl.mt.gov/Data/Spatial/MSDI/AdministrativeBoundaries/MontanaCounties_shp.zip"

mkdir -p raw-data/mt-counties
cd raw-data/mt-counties

# # Download data
# curl -o shapefile.zip $DATASOURCE
# unzip shapefile.zip

# convert everything to lowercase
# Ref: https://stackoverflow.com/questions/7787029/how-do-i-rename-all-files-to-lowercase
for f in *; do mv "$f" "$f.tmp"; mv "$f.tmp" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done

# data processing
# Documentation: https://github.com/mbloch/mapshaper/wiki/Command-Reference
# -each line strips unneeded properties and builds id label
# -explode converts MULTIPOLYGONS to POLYGON objects (app expects POLYGON)
mapshaper \
    -i ./montanacounties_shp/County.shp \
    -proj wgs84 \
    -simplify dp 20% \
    -explode \
    -each 'this.properties = {id: this.properties["NAMELABEL"], fips: this.properties["ALLFIPS"]}' \
    -o format=geojson extension=".geojson"

# move to app folder
cp ./County.geojson ./../../app/geodata/mt-counties.geojson

echo "DONE"

