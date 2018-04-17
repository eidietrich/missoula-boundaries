#!/bin/bash

# Run from repo home directory
# sh scripts/mt-schools-enrollment.sh

# Source: File from previous MT School enrollment work (data downloaded/collected from MT Office of Public Instruction website)
# TODO: Double-check this workflow, try to figure out how to automate it

SOURCE_FILE="mt-school-enrollment-all-levels.csv"
DBNAME="mt-vitality-metrics"
FOLDER="mt-schools-enrollment"

mkdir -p raw-data/$FOLDER
cd raw-data/$FOLDER


csvcut -c system_code,county,district,school,level,year,grade,gender,enrollment $SOURCE_FILE > data-cleaned.csv

psql -d mt-vitality-metrics -c "DROP TABLE mt_school_enrollment"

psql -d mt-vitality-metrics -c "CREATE TABLE mt_school_enrollment (code varchar(4), county varchar(20), district varchar(50), school varchar(50), level varchar(4), year varchar(5), grade varchar(5), gender varchar(1), enrollment integer);"

psql -d mt-vitality-metrics -c "COPY mt_school_enrollment FROM '$PWD/data-cleaned.csv' WITH CSV HEADER"

echo "DONE"