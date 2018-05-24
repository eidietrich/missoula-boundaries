import React from 'react';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts';
import { scalePow, scaleLog } from 'd3-scale';
import { max } from 'd3-array';
import {format} from 'd3-format';

// Expects data as array of objects
// [ {'xKey': VALUE, 'yKey': VALUE}, ... ]
// Trend function is (d, i, data) => {x: xi, y: yi} function for data.map

class TrendChart extends React.Component {

  render() {
    const data = this.props.data;
    const trendFunction = this.props.trendFunction;
    const range = this.props.range || [0, (dataMax) => Math.ceil(dataMax / 1000) * 1000];

    if (data === null) return null;

    const width = this.props.width || '100%';
    const height = this.props.height || '100%';

    const plotData = data.map(trendFunction)


    const lineChart = (
      <div className='metric-line-chart-wrapper' style={{ margin: 0 }}>
      <ResponsiveContainer width={'100%'} height={100}>
        <LineChart data={plotData}>
          <CartesianGrid stroke="#eee" vertical={false}/>
          <YAxis type='number' yAxisId={0} domain={range} axisLine={false} stroke="#666"
            tickFormatter={format(',')}
            label={{ value: null, angle: -90, offset: 0, position: 'insideBottomLeft', fill: "#666" }}/>
          }
          <XAxis dataKey='x' axisLine={true} stroke="#666"/>

          <ReferenceLine y={0} stroke="#444" strokeDasharray="1 1" />
          <Line dataKey='y' stroke='#ff7300' strokeWidth={2} yAxisId={0}/>
        </LineChart>
      </ResponsiveContainer>

      </div>
    );

    return lineChart;
  }
}

export default TrendChart;