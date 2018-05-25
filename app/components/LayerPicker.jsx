import React from 'react';
import { observer } from 'mobx-react';

@observer
export default class LayerPicker extends React.Component {

  render(){
    const layers = this.props.appState.layers;

    layers.forEach(d => {
      this.isLayerActive(d);
    })

    const options = layers.map(layer => {
      return (
        <div key={layer.key} className="control-layer-picker-item">
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

    return (<div className="control-layer-picker">
      <div className="control-header">Layers</div>
      {options}
    </div>);
  }

  isLayerActive(layer){
    const activeLayerKeys = this.props.appState.activeLayerKeys;
    return (activeLayerKeys.find(key => (key === layer.key)) !== undefined);
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.id;

    if (value === true){
      this.props.appState.addActiveLayer(key)
    } else {
      this.props.appState.removeActiveLayer(key)
    }
  }
}