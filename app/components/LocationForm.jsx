/* LocationForm.jsx

Component to display a form for user to enter location of interest as string address. String addresses are geocoded, with resulting lat/lng coordinate returned.

Autocomplete functionality desired: After 5 characters are entered into form, call to external geocoding API prodc

Inputs:
- props.isPointSelected - flag indicating whether app state has a coordinate point in focus (allows different display options)
- props.handleNewLatLng - supplied function for parsing an address on submit

TODO:
- Select Geocoding API to use --> Mapbox
- Set up autocomplete/dropdown form
- Wire up handleSubmit() to pass coordinate back to App state on submit

NOTES:
- Keeps track of state internally
- Form ref: https://reactjs.org/docs/forms.html

*/

import React from 'react';
import MapboxClient from 'mapbox/lib/services/geocoding';

const geocodeParameters = {
  types: 'address',
  country: 'us',
  bbox: [-116.10,44.30,-103.88,49.01] // roughly MT bounding box
}

export default class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      responses: [],
      showResponseBox: false,
    };

    this.client = new MapboxClient(process.env.MAPBOX_API_TOKEN)

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    const value = event.target.value;
    this.setState({ value: value })

    if (value.length > 5) {
      this.geocodeAddress(value);
    }
  }

  handleLocationSelect(location){
    location.latlng = location.lnglat.reverse(); // TODO: change app so everything in app expects lng, lat coordinates
    this.props.handleNewLocation(location);
    this.setState({
      showResponseBox: false,
      value: ''
    })

  }

  geocodeAddress(address){
    this.client.geocodeForward(address, geocodeParameters, (err, res) => {
      const filtered = res.features;

      // TODO: Figure out how to filter responses to MT

      this.setState({
        responses: filtered,
        showResponseBox: (filtered.length > 0)
      })
    });

  }

  render(){

    const responseLocations = this.state.responses.map((location, i) => {
      const name = location.place_name;
      const lnglat = location.center;

      return (
        <div className='location-form-response-item'
          key={String(i)}
          onClick={() => this.handleLocationSelect({
              lnglat: lnglat,
              address: name
            })}
        >
          {name}
        </div>
      )
    })

    const responseLocationClassName = (this.state.showResponseBox) ? 'location-form-response-list' : 'location-form-response-list hide'

    return (
      <div className='location-form-container'>
        <div className='location-form-label'>Enter address</div>
        <form onSubmit={this.handleSubmit}>
          <input className='location-form-input'
            type="text" value={this.state.value} onChange={this.handleChange} />
        </form>
        <div className={responseLocationClassName}>
          {responseLocations}
        </div>
      </div>
    )
  }


}