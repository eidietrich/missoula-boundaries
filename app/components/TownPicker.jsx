import React from 'react';

import centroid from '@turf/centroid';

// Expects props.options as a geojson of geographies to select

// TODO: Figure out how to provide for keyboard navigation here
// Translate handleSelect into map control
// clean up options

export default class TownPicker extends React.Component {
  constructor(props) {
    super(props);
    this.options = this.buildOptions(this.props.options);
    this.state = {
      value: '',
      responses: this.options,
      showResponseBox: false,
    };
  }

  buildOptions(rawOptions){
    // Assume rawOptions is a geojson collection

    const options = rawOptions ? rawOptions.features.map(d => {
      // return d.properties.id;
      return {
        key: d.properties.fips,
        name: d.properties.id,
        value: d.properties.id,
        type: d.properties.type,
        label: `${d.properties.id} (${d.properties.type})`,
        shape: d.geometry,
        lnglat: centroid(d.geometry).geometry.coordinates,
      }
    }) : [];

    return options.sort((a,b) => a.name.localeCompare(b.name))
  }


  render(){
    let locationDropdown;
    if (this.state.showResponseBox){
      const responseLocations = this.state.responses.map((location, i) => {
        const name = location.label;
        // const lnglat = location.center;

        return (
          <div className='Dropdown-option'
            key={String(i)}
            onClick={() => this.handleSelect(location)}
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
        <form>
          <input className='location-form-input'
            type="text"
            value={this.state.value}
            onChange={this.handleInputChange.bind(this)}
            onFocus={this.handleInputFocus.bind(this)}
            placeholder='Search/select town'
          />
        </form>
        {locationDropdown}
      </div>
    )
  }

  handleInputChange(event){
    const value = event.target.value;
    this.setState({
      value: value
    })

    this.getMatching(value);
  }

  getMatching(value){
    const matching = this.options.filter(d => d.name.toUpperCase().includes(value.toUpperCase()))
    this.setState({
      responses: matching,
      showResponseBox: true
    })
  }

  handleInputFocus(){
    console.log('focus')
    this.setState({
      value: '',
      responses: this.options,
      showResponseBox: true
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

  handleSelect(option){
    console.log('selecting', option);

    this.props.handleChoice(option)

    this.setState({
      value: option.label,
      responses: this.options,
      showResponseBox: false,
    })
  }
}
