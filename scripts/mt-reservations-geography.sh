#!/bin/bash

# Run from repo home directory
# sh scripts/mt-reservations-geography.sh

# USING THIS SCRIPT (tuns out census geography doesn't have the code you need to join with enrollment data)

DATASOURCE="http://ftp.geoinfo.msl.mt.gov/Data/Spatial/MSDI/AdministrativeBoundaries/MontanaReservations_shp.zip"
FOLDER="mt-reservations-geography"

mkdir -p raw-data/$FOLDER
cd raw-data/$FOLDER

# # Download data
curl -o shapefile.zip $DATASOURCE
unzip shapefile.zip


# data processing
# Documentation: https://github.com/mbloch/mapshaper/wiki/Command-Reference
# -each line strips unneeded properties and builds id label

mapshaper \
    -i MontanaReservations_shp/MontanaReservations.shp \
    -simplify dp 20% \
    -clean \
    -each 'this.properties = {id: this.properties["NAME"]}' \
    -proj wgs84 \
    -o format=geojson extension=".geojson" mt-reservations.geojson

# move to app folder

cp mt-reservations.geojson ./../../app/geodata/mt-reservations.geojson

echo "DONE"

