#!/bin/bash

# Run from repo home directory
# sh scripts/mt-counties-population.sh

# Data sources
# mt190090.txt - from https://www.census.gov/population/cencounts/mt190090.txt (county pops through 1990)
# 2000 & 2010 county population downloaded from FactFinder 4/20/18
# Merged manually (dropped historic Yellowstone NP populations ~< 50 ppl)
# --> mt-counties-population-historic.csv

# merge/clean script (add in most-recent data via census API)

FOLDER="mt-counties-population"

python3 ./scripts/mt-counties-population-sub.py

cd raw-data/$FOLDER

psql -d mt-vitality-metrics -c "DROP TABLE mt_county_population"

psql -d mt-vitality-metrics -c "CREATE TABLE mt_county_population (fips varchar(5),  place varchar(50), year varchar(4), population real);"

psql -d mt-vitality-metrics -c "COPY mt_county_population FROM '$PWD/mt-counties-population-tidied.csv' WITH CSV HEADER"

echo "DONE"