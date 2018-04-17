import React from 'react';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts';
import { scalePow, scaleLog } from 'd3-scale';
import { max } from 'd3-array';

export default class SchoolEnrollmentResults extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    if(this.props.data === null) return null;

    const data = this.props.data.enrollment;

    const curYear = data.slice(-1)[0].year
    const curEnrollment = data.slice(-1)[0].enrollment
    const baseline = data[0].enrollment
    const baseYear = data[0].year
    const change = curEnrollment - baseline;
    const changeDirection = (change >= 0) ? 'up' : 'down'

    // enrollmentList = enrollment.enrollment.map(d => {
    //     return (<li key={d.year}>
    //       {`${d.year}: ${d.enrollment}`}
    //     </li>);
    //   }

    const description = `${curEnrollment} high school students in ${curYear} (${changeDirection} ${Math.abs(change)} from ${baseYear})`

    // calculate percent change
    data.forEach(d => {
      d.index = d.enrollment / baseline * 100;
    })
    const yMax = max(data, d => d.enrollment)

    const lineChart = (
      <div className='line-chart-wrapper' style={{ margin: 20 }}>
        <LineChart width={400} height={150} data={data}>
          <CartesianGrid stroke="#eee" vertical={false}/>
          <YAxis type='number' yAxisId={0} domain={[60, 140]} axisLine={false} stroke="#666"
            label={{ value: '% of 07-08', angle: -90, offset: 15, position: 'insideBottomLeft', fill: "#666" }}/>
          }
          <XAxis dataKey='year' axisLine={true} stroke="#666"/>

          <ReferenceLine y={100} stroke="#444" strokeDasharray="1 1" />
          <Line dataKey='index' stroke='#ff7300' strokeWidth={2} yAxisId={0}/>
        </LineChart>

      </div>
    );

    return (
      <div>
        <h4>Enrollment</h4>
        <p>{description}</p>
        {lineChart}
        <p>Data: Montana Office of Public Instruction</p>
      </div>
    );
  }


}