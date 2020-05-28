import React from 'react'
import { Chart } from 'react-google-charts'
import Typography from '@material-ui/core/Typography'

type BarChartProps = {
    timestamps: number[][]
}

const BarChart = (props: BarChartProps) => {
  const { timestamps } = props
  const reversedTimestamps = [...timestamps].reverse()

  const events = reversedTimestamps.map((dataForDay, index) => {
    const count = dataForDay.length
    const date = new Date(dataForDay[0] * 1000)
    const dayLabel = `${date.getDate()}.${date.getMonth() + 1}`

    return [ dayLabel, count ]
  })

  return (
    <div>
      <Typography variant="h4" component="h4">
        Weekly Traffic
      </Typography>
    <Chart
      width={'800px'}
      height={'300px'}
      chartType='ColumnChart'
      loader={<div>Loading Chart</div>}
      data={[
        ['Day', 'Events per day'],
        ...events,
      ]}
      options={{
        vAxis: {
          minValue: 0,
          maxValue: 15,
        }
      }}
      rootProps={{ 'data-testid': '1' }}
    />
    </div>
  )
}

export default BarChart
