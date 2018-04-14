// Data import
// #TODO: Find a cleaner way to import multiple datafiles?
// Eventually extract this to its own file
import mtHouseDistricts from './../geodata/mt-house-districts.geojson';
import mtSenateDistricts from './../geodata/mt-senate-districts.geojson';
import mtElemSchools from './../geodata/mt-elem-districts.geojson';
import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtK12Schools from './../geodata/mt-k12-districts.geojson';

import mtTowns from './../geodata/mt-places.geojson';



const layers = [
  {key: 'legislature-house', category: 'Montana Legislature', label: 'House Districts', data: mtHouseDistricts},
  {key: 'legislature-senate', category: 'Montana Legislature', label: 'Senate Districts', data: mtSenateDistricts},
  {key: 'schools-elementary', category: 'Montana Schools', label: 'Elementary School Districts', data: mtElemSchools},
  {key: 'schools-secondary', category: 'Montana Schools', label: 'High School Districts', data: mtHighSchools},
  {key: 'schools-k12', category: 'Montana Schools', label: 'K-12 School Districts', data: mtK12Schools},
  // {key: 'places', category: 'Montana towns', label: 'Towns', data: mtTowns},
];

export default layers;