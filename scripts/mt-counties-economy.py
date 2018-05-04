#!/usr/bin/env python3
'''

Script for pulling in county-level data from BEA API

Currently gets per-capita income data for MT counties
TODO: Look for other metrics, set this up to pull in multiple values and combine to singular

To run (from project base directory)

python3 scripts/mt-counties-economy.py

'''
#

# Initial goal: get per-capita income data for MT counties
# TABLE CA1

import requests
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.types import Integer

api_base = 'https://www.bea.gov/api/data'
user_id = '0359863C-C1DB-40F5-8134-959DC689A3BB' # TODO: Obscure this

db_path = 'postgresql://ericdietrich@localhost:5432/mt-vitality-metrics'
table_name = 'mt_county_economy'
db = create_engine(db_path)

# payload = {
#     'UserID': '0359863C-C1DB-40F5-8134-959DC689A3BB',
#     'Method': 'getdata',
#     'datasetname': 'regionalincome',
#     'year': 2016,
#     'geofips': 'STATE',
#     'tablename': 'CA1',
#     'linecode': 3
# }

def get_table_linecodes(tablename):
    pass
    # TODO - convenience function for looking for other metrics

def get_data(payload):
    r = requests.get(api_base, params=payload)
    data = r.json()['BEAAPI']['Results']['Data']
    return pd.DataFrame(data)

def inMontana(fips5):
    return fips5[:2] == '30'

metrics = [
    { 'metric': 'pc_income', 'table': 'CA1', 'linecode': 3}
]

payload = {
    'UserID': user_id,
    'Method': 'getdata',
    'datasetname': 'regionalincome',
    'year': 'all',
    'geofips': 'COUNTY',
    'tablename': 'CA1',
    'linecode': 3
}

inc_cols = {
    'GeoName': 'name',
    'GeoFips': 'fips',
    'DataValue': 'pc_income',
    'TimePeriod': 'year'
}

print('Starting')

raw = get_data(payload)

print('Raw data downloaded')

df = raw[raw['GeoFips'].apply(inMontana)]
df = df[list(inc_cols.keys())]
df.rename(columns=inc_cols, inplace=True)
df['name'] = df['name'].str.replace(', MT','')

print('Data cleaned')

df.to_sql(
    name=table_name,
    con=db,
    if_exists='replace',
    index=False,
    dtype={'pc_income': Integer}
)

print('Done')




