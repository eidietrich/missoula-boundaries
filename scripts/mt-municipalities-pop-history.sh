#!/bin/bash

# Run from repo home directory
# sh scripts/mt-schools-enrollment.sh

# Source: File downloaded summer 2017 from MT CENSUS & ECONOMIC INFORMATION CENTER (As of April 2017 it looks like it's no longer up on their website)
# Also downloaded 2016 data from census bureau (file conveniently includes FIPS codes)

# Performed a manual join - turns out the CEIC file includes some no-longer disincorporated communities

EXCEL_FILE="Census_1890-2010_TotalPop_MTIncorporatedPlaces.xlsx"
CURRENT_CENSUS_Folder="PEP_2016_PEPANNRES"
DBNAME="mt-vitality-metrics"
FOLDER="mt-places-population"

python3 ./scripts/mt-school-enrollment-sub.py

cd raw-data/$FOLDER

psql -d mt-vitality-metrics -c "DROP TABLE mt_place_population"

psql -d mt-vitality-metrics -c "CREATE TABLE mt_place_population (fips varchar(5),  place varchar(50), year varchar(4), population real);"

psql -d mt-vitality-metrics -c "COPY mt_place_population FROM '$PWD/mt-incorporated-population-tidied.csv' WITH CSV HEADER"

echo "DONE"

