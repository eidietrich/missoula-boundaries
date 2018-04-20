'''
Run from repo home directory
python3 mt-municipalities-pop-history.py

Source: File downloaded summer 2017 from MT CENSUS & ECONOMIC INFORMATION CENTER (As of April 2017 it looks like it's no longer up on their website)
Manually cleaned/FIPS codes added.

This does an auto join against census API population data
(Could adjust API call to bring in more years of data)

TODO: Figure out how to pull data for census designated places here (look to IPUMS data?)

TODO: Figure out how to connect with database in here directly to avoid redundant bash script

'''

import pandas as pd
import requests
from sqlalchemy import create_engine

# import historic census data
old = pd.read_csv('raw-data/mt-places-population/mt-ceic-historic-census-incorporated.csv', dtype={'fips': str})

r = requests.get('https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=place:*&in=state:30')

data = r.json()

new = pd.DataFrame(data[1:], columns=data[0])

df = old.merge(new, left_on='fips', right_on='place')
df.rename(columns={'place_x':'place', 'POP': '2016 POP'}, inplace=True)

df = df[['fips', 'place', '2010 CENSUS', '2000 CENSUS', '1990 CENSUS','1980 CENSUS', '1970 CENSUS', '1960 CENSUS', '1950 CENSUS', '1940 CENSUS', '1930 CENSUS', '1920 CENSUS', '1910 CENSUS', '1900 CENSUS', '1890 CENSUS', '2016 POP']]

df.to_csv('raw-data/mt-places-population/mt-incorporated-population-joined.csv', index=False)

columns = {
    '2016 POP': '2016',
    '2010 CENSUS': '2010',
    '2000 CENSUS': '2000',
    '1990 CENSUS': '1990',
    '1980 CENSUS': '1980',
    '1970 CENSUS': '1970',
    '1960 CENSUS': '1960',
    '1950 CENSUS': '1950',
    '1940 CENSUS': '1940',
    '1930 CENSUS': '1930',
    '1920 CENSUS': '1920',
    '1910 CENSUS': '1910',
    '1900 CENSUS': '1900',
    '1890 CENSUS': '1890',
}
df.rename(columns=columns, inplace=True)

dfm = df.melt(id_vars=['fips','place'], var_name='year', value_name='population')

dfm.to_csv('raw-data/mt-places-population/mt-incorporated-population-tidied.csv', index=False)

# DB Connection
# THIS ISN'T WORKING CURRENTLY
# USING psql from bash script instead
engine = create_engine('postgresql://ericdietrich@localhost:5432/mt-vitality-metrics')
table_name = 'mt_place_populations'

df.to_sql('table_name', engine, if_exists='replace')




