import React from 'react';

import { format } from 'd3-format';

import TrendChart from './../TrendChart.jsx';

const f = format(',')
const p = format('.1%')

export default class SchoolTaxBaseResults extends React.Component {
  render() {
    if(this.props.data === null) return null;

    const data = this.props.data.taxBase;

    const curYear = data.slice(-1)[0].year
    const curTaxBase = data.slice(-1)[0].taxBase
    const baseline = data[0].taxBase
    const baseYear = data[0].year
    const change = curTaxBase - baseline;
    const changeDirection = (change >= 0) ? 'up' : 'down'

    // const description = `${f(curEnrollment)} high school students in ${curYear} (${changeDirection} ${f(Math.abs(change))} from ${baseYear})`
    const description = null;

    // calculate percent change
    data.forEach(d => {
      d.index = (d.taxBase / baseline - 1) * 100;
    })

    const lineChart = <TrendChart
      data={data}
      range={[-100,100]}
      trendFunction={(d, i, data) => {
        const baseline = data[0].taxBase;
        return {
          x: d.year,
          y: d.taxBase
        }
      }}
    />

    return (
      <div className="metric-container">
        <div className="metric-header">Tax Base</div>
        <div className="metric-description">{description}</div>
        {lineChart}
        <div className="metric-note">Data: Montana Office of Public Instruction</div>
      </div>
    );
  }


}