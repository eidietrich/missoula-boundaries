import React from 'react';

import TrendChart from './TrendChart.jsx';

export default class CountyPopulationResults extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  buildTrendDescription(data){
    const baseYear = '1990'

    const current = data.slice(-1)[0]
    const peak = data.reduce((a, b) => a.population > b.population ? a : b)
    const base = data.find(d => d.year === baseYear)

    let description = '';
    if (peak.year === current.year){
      // Describe if current population is peak

      const changeSinceBase = current.population - base.population;
      const perChangeSinceBase = Math.round(changeSinceBase / base.population * 100);

      description = `${current.population} residents in ${current.year} (up ${changeSinceBase}, or ${perChangeSinceBase} percent, since ${baseYear}).`
    } else {
      // Describe if current population is not peak

      const changeSincePeak = Math.abs(current.population - peak.population);
      const perChangeSincePeak = Math.round(changeSincePeak / peak.population * 100)

      description = `${current.population} residents in ${current.year} (down ${changeSincePeak}, or ${perChangeSincePeak} percent, from peak of ${peak.population} in ${peak.year}).`
    }

    return description;
  }

  render() {
    if(this.props.data === null) return null;
    const data = this.props.data.population;

    const description = this.buildTrendDescription(data);

    const lineChart = <TrendChart
      data={data}
      trendFunction={(d, i, data) => {
        return {x: d.year, y: d.population};
      }}
    />

    return (
      <div>
        <h4>Population</h4>
        <p>{description}</p>
        {lineChart}
        <p>Data: US Census Bureau.</p>
      </div>
    );
  }


}