// Data import
// #TODO: Find a cleaner way to import multiple datafiles?
// Eventually extract this to its own file
import mtHouseDistricts from './../geodata/mt-house-districts.geojson';
import mtSenateDistricts from './../geodata/mt-senate-districts.geojson';
import mtElemSchools from './../geodata/mt-elem-districts.geojson';
import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtTowns from './../geodata/mt-places.geojson';
import mtCounties from './../geodata/mt-counties.geojson';


// const layers = [
//   {key: 'places', category: 'Montana towns', label: 'Towns', data: mtTowns},
//   {key: 'counties', category: 'Montana counties', label: 'Counties', data: mtCounties},
//   // {key: 'legislature-house', category: 'Montana Legislature', label: 'House Districts', data: mtHouseDistricts},
//   // {key: 'legislature-senate', category: 'Montana Legislature', label: 'Senate Districts', data: mtSenateDistricts},
//   // {key: 'schools-elementary', category: 'Montana Schools', label: 'Elementary School Districts', data: mtElemSchools},
//   {key: 'schools-secondary', category: 'Montana Schools', label: 'High School Districts', data: mtHighSchools},
// ];

/* V2.0

Work in progress here

Idea is to set up an info that
- [ ] works with DataManager.js,
- [ ] feeds into DistrictMap focusFeatures,
- [ ] tells DistrictResults.jsx which values to display
- [ ] enables a toggle layer on/off state functionality

*/

const layers = [
  {
    key: 'places',
    label: 'Towns',
    cssClass: 'town',
    geodata: mtTowns,
  },
  {
    key: 'schools-secondary',
    label: 'High School Districts',
    cssClass: 'school',
    geodata: mtHighSchools,
  },
  {
    key: 'counties',
    label: 'Counties',
    cssClass: 'county',
    geodata: mtCounties,
  },
]

export default layers;