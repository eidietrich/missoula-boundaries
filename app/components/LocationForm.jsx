/* LocationForm.jsx

Component to display a form for user to enter location of interest as string address. String addresses are geocoded, with resulting lat/lng coordinate returned.

Autocomplete functionality desired: After 5 characters are entered into form, call to external geocoding API prodc

Inputs:
- props.isPointSelected - flag indicating whether app state has a coordinate point in focus (allows different display options)
- props.handleNewLatLng - supplied function for parsing an address on submit

TODO:
- Select Geocoding API to use (Mapbox? Google Maps?)
- Set up autocomplete/dropdown form
- Wire up handleSubmit() to pass coordinate back to App state on submit

*/

import React from 'react';

export default class App extends React.Component {
  render(){
    return (
      <div className='location-form-container'>
        #TODO: Location Form
      </div>
    )
  }

  geocodeAddress(address){
    // interface with external API (Mapbox? Google?) to translate a string address into a [lat, lng] coordinate

  }

  handleSubmit(latLng){
    // pass chosen coordinate back up to App
    this.props.handleNewLatLng(latLng)
  }


}