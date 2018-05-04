#!/usr/bin/env python3
'''

python3 scripts/mt-counties-population.py

Script for pulling county population data from census API, merging it with historical data and putting it in database

# Sourcing for historic data
- mt190090.txt - from https://www.census.gov/population/cencounts/mt190090.txt (county pops through 1990)
- 2000 & 2010 county population downloaded from FactFinder 4/20/18
- Merged manually (dropped historic Yellowstone NP populations ~< 50 ppl)
--> mt-counties-population-historic.csv

'''

import pandas as pd
import requests

from sqlalchemy import create_engine
from sqlalchemy.types import Integer

db_path = 'postgresql://ericdietrich@localhost:5432/mt-vitality-metrics'
table_name = 'mt_county_population'
db = create_engine(db_path)


old = pd.read_csv('raw-data/mt-counties-population/mt-counties-population-historic.csv', dtype={'fips': str})

r = requests.get('https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=county:*&in=state:30')

data = r.json()

new = pd.DataFrame(data[1:], columns=data[0])

# Joining on 5-digit fips (w/ 30 state code)
new['fips'] = new['state'] + new['county']

df = old.merge(new, left_on='fips', right_on='fips')

df.rename(columns={'POP': '2016'}, inplace=True)

df = df[['fips', 'name', '2016', '2010', '2000', '1990', '1980', '1970', '1960', '1950',
       '1940', '1930', '1920', '1910', '1900'
       ]]

dfm = df.melt(id_vars=['fips','name'], var_name='year', value_name='population')

# dfm.to_csv('raw-data/mt-counties-population/mt-counties-population-tidied.csv', index=False)

print('Writing to database')

dfm.to_sql(
    name=table_name,
    con=db,
    if_exists='replace',
    index=False,
    dtype={'population': Integer}
)