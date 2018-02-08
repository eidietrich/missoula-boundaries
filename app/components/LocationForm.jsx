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
      responses: []
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

  handleLocationSelect(lnglat){
    var latlng = lnglat.reverse(); // TODO: change app so everything in app expects lng, lat coordinates
    this.props.handleNewLatLng(latlng);

  }

  geocodeAddress(address){
    this.client.geocodeForward(address, geocodeParameters, (err, res) => {
      const filtered = res.features;

      // TODO: Figure out how to filter responses to MT

      this.setState({
        responses: filtered
      })
    });

  }

  render(){

    const responseLocations = this.state.responses.map((location, i) => {
      const name = location.place_name;
      const lnglat = location.center;

      return (
        <li key={String(i)}
          onClick={() => this.handleLocationSelect(lnglat)}
        >
          {name}
        </li>
      )
    })

    return (
      <div className='location-form-container'>
        #TODO: Location Form
        <form onSubmit={this.handleSubmit}>
            <label>
              Enter address
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
        </form>
        <ul>
          {responseLocations}
        </ul>
      </div>
    )
  }


}