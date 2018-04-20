import pandas as pd
import requests

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

dfm.to_csv('raw-data/mt-counties-population/mt-counties-population-tidied.csv', index=False)