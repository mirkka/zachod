import React from 'react'
import { Chart } from 'react-google-charts'
import { Typography } from '@material-ui/core'
import { format } from 'date-fns'

type TimelineProps = {
    timestamps: number[]
    label: string
}

const Timeline = (props: TimelineProps) => {
  const { timestamps, label } = props

  if (!timestamps) {
    return null
  }

  const date = new Date(label)
  const formatDateLabel = format(date, 'dd.MM')

  const events = timestamps.map((timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return [ label, date, date ]
  })

  const startOfDay = new Date(date)
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23)
  endOfDay.setMinutes(59)
  endOfDay.setSeconds(59)

  return (
    <div>
      <Typography variant="h6" component="h6">
        {formatDateLabel}
      </Typography>
      { timestamps.length === 0 && <p>(no data)</p> }
      { timestamps.length > 0 && <Chart
        width={'100%'}
        height={'100px'}
        chartType='Timeline'
        loader={<div>Loading Chart</div>}
        data={[
          [
            { type: 'string', id: 'events' },
            { type: 'number', id: 'Start' },
            { type: 'number', id: 'End' },
          ],
          ...events,
        ]}
        options={{
          showRowNumber: true,
          timeline: {
            showRowLabels: false,
          },
          hAxis: {
            minValue: startOfDay,
            maxValue: endOfDay,
            format: 'H',
          }
        }}
        rootProps={{ 'data-testid': '1' }}
      /> }
    </div>
  )
}

export default Timeline
