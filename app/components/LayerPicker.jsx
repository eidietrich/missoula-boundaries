import React from 'react';

export default class LayerPicker extends React.Component {

  render(){
    const layers = this.props.layers;

    layers.forEach(d => {
      this.isLayerActive(d);
    })

    const options = layers.map(layer => {
      return (
        <div key={layer.key}>
          <input
            type="checkbox"
            name={layer.label}
            id={layer.key}
            checked={this.isLayerActive(layer)}
            onChange={this.handleChange.bind(this)}
          />
          <label htmlFor={layer.key}>{layer.label}</label>
        </div>
      )
    })

    return (<div>
      <div>Showing layers</div>
      {options}
    </div>);
  }

  isLayerActive(layer){
    const activeLayers = this.props.activeLayers;
    return (activeLayers.find(d => d.key === layer.key) !== undefined)
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.id;

    if (value === true){
      this.props.addActiveLayer(key)
    } else {
      this.props.removeActiveLayer(key)
    }
  }
}