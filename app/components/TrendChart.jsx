import React from 'react';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts';
import { scalePow, scaleLog } from 'd3-scale';
import { max } from 'd3-array';

// Expects data as array of objects
// [ {'xKey': VALUE, 'yKey': VALUE}, ... ]
// Trend function is (d, i, data) => {x: xi, y: yi} function for data.map

export default class TrendChart extends React.Component {

  render() {
    const data = this.props.data;
    const trendFunction = this.props.trendFunction;

    if (data === null) return null;

    // const xKey = this.props.xKey; // unused
    // const yKey = this.props.yKey;

    const plotData = data.map(trendFunction)


    // const baseline = data[0][yKey]
    // data.forEach(d => {
    //   d.pChange = (d[yKey] / baseline - 1) * 100;
    // })

    const lineChart = (
      <div className='line-chart-wrapper' style={{ margin: 20 }}>
        <LineChart width={400} height={150} data={plotData}>
          <CartesianGrid stroke="#eee" vertical={false}/>
          <YAxis type='number' yAxisId={0} domain={[-100, 100]} axisLine={false} stroke="#666"
            label={{ value: '% change', angle: -90, offset: 15, position: 'insideBottomLeft', fill: "#666" }}/>
          }
          <XAxis dataKey='x' axisLine={true} stroke="#666"/>

          <ReferenceLine y={0} stroke="#444" strokeDasharray="1 1" />
          <Line dataKey='y' stroke='#ff7300' strokeWidth={2} yAxisId={0}/>
        </LineChart>

      </div>
    );

    return lineChart;
  }
}