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
- Dropdown styling cribbed from react-dropdown: https://github.com/fraserxu/react-dropdown

*/

import React from 'react';
import MapboxClient from 'mapbox/lib/services/geocoding';

const geocodeParameters = {
  types: 'address',
  country: 'us',
  bbox: [-116.10,44.30,-103.88,49.01] // roughly MT bounding box
}

// Regex for trimming address place name
const placeNameStateCountry = /, Montana 59\d{3}, United States/;

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
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);

  }

  handleChange(event){
    // geocode if there are enough characters, otherwise reset input
    const numCharThrehold = 5;
    const value = event.target.value;
    this.setState({ value: value })

    if (value.length > numCharThrehold) {
      this.geocodeAddress(value);
    } else {
      this.setState({
        responses: [],
        showResponseBox: false,
      })
    }
  }

  handleLocationSelect(location){
    this.props.handleNewLocation(location);
    this.setState({
      showResponseBox: false,
      value: ''
    })

  }

  handleInputFocus(){
    console.log('focus')
    this.setState({
      value: '',
    })
  }

  handleInputBlur(){
    console.log('blur')
    this.setState({
      value: this.props.focusAddress,
      responses: [],
      showResponseBox: false,
    })
  }

  geocodeAddress(address){
    this.client.geocodeForward(address, geocodeParameters, (err, res) => {

      // filter to MT addresses using state name and first 2 digits of zipcode
      const filtered = res.features.filter(feature => {
          return feature.place_name.includes('Montana 59')
      });

      this.setState({
        responses: filtered,
        showResponseBox: (filtered.length > 0)
      })
    });

  }

  render(){
    let locationDropdown;
    if (this.state.showResponseBox){
      const responseLocations = this.state.responses.map((location, i) => {
        const name = location.place_name.replace(placeNameStateCountry, '');
        const lnglat = location.center;

        return (
          <div className='Dropdown-option'
            key={String(i)}
            onClick={() => this.handleLocationSelect({
                lnglat: lnglat,
                address: name
              })}
          >
            {name}
          </div>
        )
      });
      locationDropdown = (
        <div className='Dropdown-menu'>
          {responseLocations}
        </div>
      );
    } else {
      locationDropdown = null;
    }

    return (
      <div className='location-form-container'>
        <form onSubmit={this.handleSubmit}>
          <input className='location-form-input'
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            placeholder='Enter address'
          />
        </form>
        {locationDropdown}
      </div>
    )
  }


}