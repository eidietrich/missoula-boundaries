# helper script for school enrollment data import
# designed to be called from project root folder

import pandas as pd
import numpy as np



df = pd.read_excel('./raw-data/mt-schools-enrollment/ALLYEARS91_18.xlsx', dtype={'LE': str})
inc_cols = {
    'LE': 'le_code',
    'LE_NAME': 'name',
    'COUNTYNAME': 'county',
    'LEVEL': 'level',
    'YEAR': 'year',
    'ANB_EL': 'elem_enrollment',
    'ANB_HS': 'hs_enrollment',
    'ANB': 'tot_enrollment',
    'GF_BDGT': 'general_fund_budget',
    'TAX_VAL': 'tax_base'
}
df = df[list(inc_cols.keys())]

# CHEATING WAY TO CLEAN UP STUBBORN NULL VALUE
# b/c Three Forks school district is mis-entered
df.loc[10647,'ANB_EL'] = np.nan
df.loc[10646,'ANB_HS'] = np.nan

# Can check for nulls in column with
#df[df['ANB_EL'].apply(np.isreal) != True]

# Test whether ANB total matches HS and ELEM levels
# df[df['ANB_EL'] + df['ANB_HS'] != df['ANB']]

# Take just HS data (for now)
# 'LEVEL' is messy as hell
# df['LEVEL'].value_counts()
# E      4195
# EL     3918
# HS     1590
# H      1522
# K12     822
# C       453 --> K12 schools
# N        68 --> elementaries from early 90s

df_hs = df[df['ANB_HS'] > 0]
df_hs['LEVEL'] = 'HS' # Standardize

df_hs.rename(columns=inc_cols, inplace=True)

df_hs.to_csv('./raw-data/mt-schools-enrollment/mt-hs-enrollment-91-18-cleaned.csv',index=False)

print('python script done')