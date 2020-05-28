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

  const formatDateLabel = format(new Date(timestamps[0] * 1000), 'dd.MM')

  const events = timestamps.map((timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return [ label, date, date ]
  })

  const firstTimestampOfTheDay = timestamps[0] * 1000
  const startOfToday = new Date(firstTimestampOfTheDay)
  startOfToday.setHours(0)
  startOfToday.setMinutes(0)
  startOfToday.setSeconds(0)

  const endOfToday = new Date(firstTimestampOfTheDay)
  endOfToday.setHours(23)
  endOfToday.setMinutes(59)
  endOfToday.setSeconds(59)

  return (
    <div>
      <Typography variant="h6" component="h6">
        {formatDateLabel}
      </Typography>
      <Chart
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
            minValue: startOfToday,
            maxValue: endOfToday,
            format: 'H',
          }
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  )
}

export default Timeline
