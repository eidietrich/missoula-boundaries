#!/bin/bash

# Run from repo home directory
# sh scripts/mt-places-population.sh

# TODO: Make this more generalized

DATASOURCE="https://www2.census.gov/programs-surveys/popest/datasets/2010-2016/cities/totals/sub-est2016_30.csv"
DBNAME="mt-vitality-metrics"

mkdir -p raw-data/mt-places-population
cd raw-data/mt-places-population

# Download data
curl -o pop-data.csv $DATASOURCE

csvcut -c PLACE,NAME,POPESTIMATE2010,POPESTIMATE2011,POPESTIMATE2012,POPESTIMATE2013,POPESTIMATE2014,POPESTIMATE2015,POPESTIMATE2016 pop-data.csv > pop-data-cleaned.csv

psql -d mt-vitality-metrics -c "DROP TABLE mt_place_populations"

psql -d mt-vitality-metrics -c "CREATE TABLE mt_place_populations (place varchar(5), name varchar(100), population_2010 integer, population_2011 integer, population_2012 integer, population_2013 integer, population_2014 integer, population_2015 integer, population_2016 integer);"

psql -d mt-vitality-metrics -c "COPY mt_place_populations FROM '$PWD/pop-data-cleaned.csv' WITH CSV HEADER"


echo "DONE"