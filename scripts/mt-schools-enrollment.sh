#!/bin/bash

# Run from repo home directory
# sh scripts/mt-schools-enrollment.sh

# Source: File from previous MT School enrollment work (data downloaded from MT Office of Public Instruction website via April 17, 2018 data request)

EXCEL_FILE="ALLYEARS91_18.xlsx"
DBNAME="mt-vitality-metrics"
FOLDER="mt-schools-enrollment"

python3 ./scripts/mt-school-enrollment-sub.py

cd raw-data/$FOLDER

# NOTE: in2csv is choking on the xlsx file for some reason. Converted to .csv using python script (data needs some cleaning anyway)

psql -d mt-vitality-metrics -c "DROP TABLE mt_school_enrollment"

psql -d mt-vitality-metrics -c "CREATE TABLE mt_school_enrollment (code varchar(4),  district varchar(50), county varchar(20), level varchar(4), year varchar(4), elem_enrollment real, hs_enrollment real, tot_enrollment real, gen_budget real, tax_val real);"

psql -d mt-vitality-metrics -c "COPY mt_school_enrollment FROM '$PWD/mt-hs-enrollment-91-18-cleaned.csv' WITH CSV HEADER"

echo "DONE"

