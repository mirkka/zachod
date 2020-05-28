import React from 'react'
import { Chart } from 'react-google-charts'

type TimelineProps = {
    timestamps: number[]
    label: string
}

const Timeline = (props: TimelineProps) => {
  const { timestamps, label } = props

  if (!timestamps) {
    return null
  }

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
          showRowLabels: true,
        },
        hAxis: {
          minValue: startOfToday,
          maxValue: endOfToday,
          format: 'H',
        }
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  )
}

export default Timeline
