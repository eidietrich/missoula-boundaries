// Data import
// #TODO: Find a cleaner way to import multiple datafiles?
// Eventually extract this to its own file
import mtHouseDistricts from './../geodata/mt-house-districts.geojson';
import mtSenateDistricts from './../geodata/mt-senate-districts.geojson';



const layers = [
  {key: 'house-districts', label: 'Montana House Districts', data: mtHouseDistricts},
  {key: 'senate-districts', label: 'Montana Senate Districts', data: mtSenateDistricts}
];

export default layers;