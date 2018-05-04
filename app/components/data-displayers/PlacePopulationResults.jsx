import React from 'react';

import { format } from 'd3-format';

import TrendChart from './../TrendChart.jsx';

const f = format(',')
const p = format('.1%')

export default class PlacePopulationResults extends React.Component {
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
      const perChangeSinceBase = changeSinceBase / base.population;

      description = `${f(current.population)} residents in ${current.year} (up ${f(changeSinceBase)}, or ${p(perChangeSinceBase)}, since ${baseYear}).`
    } else {
      // Describe if current population is not peak

      const changeSincePeak = Math.abs(current.population - peak.population);
      const perChangeSincePeak = changeSincePeak / peak.population

      description = `${f(current.population)} residents in ${current.year} (down ${f(changeSincePeak)}, or ${p(perChangeSincePeak)}, from peak of ${f(peak.population)} in ${peak.year}).`
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
      <div className="metric-container">
        <div className="metric-header">Population</div>
        <div className="metric-description">{description}</div>
        {lineChart}
        <div className="metric-note">Data: US Census Bureau. Pre-2010 figures collected by Montana Census and Economic Information Center</div>
      </div>
    );
  }


}