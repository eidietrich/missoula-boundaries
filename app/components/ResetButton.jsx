import React from 'react';

const icon = (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 18 18"><path d="M9 13.5c-2.49 0-4.5-2.01-4.5-4.5S6.51 4.5 9 4.5c1.24 0 2.36.52 3.17 1.33L10 8h5V3l-1.76 1.76C12.15 3.68 10.66 3 9 3 5.69 3 3.01 5.69 3.01 9S5.69 15 9 15c2.97 0 5.43-2.16 5.9-5h-1.52c-.46 2-2.24 3.5-4.38 3.5z"/></svg>);

export default class ResetButton extends React.Component {
  render(){
    return (
      <button className="btn"
        onClick={this.props.onClick} >
        Statewide
      </button>
    );
  }
}