import React from 'react';

export default class LayerPicker extends React.Component {

  render(){
    const layers = this.props.layers;

    const options = layers.map(layer => {
      return (
        <div key={layer.key}>
          <input type="checkbox"
            name={layer.label} id={layer.key}/>
          <label htmlFor={layer.key}>{layer.label}</label>
        </div>
      )
    })

    return (<div>
      <div>Showing layers</div>
      {options}
    </div>);
  }
}