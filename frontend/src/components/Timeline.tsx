import React from 'react'
import { useMutation } from "@apollo/react-hooks"
import { Chart } from 'react-google-charts'
import { Typography } from '@material-ui/core'
import { format } from 'date-fns'
import { DELETE_EVENT_MUTATION, TIMESTAMPS } from '../api'
import { getWeekDayslabels } from '../helpers'

type TimelineProps = {
    timestamps: number[]
    label: string
}

const Timeline = (props: TimelineProps) => {
  const { timestamps, label } = props
  const [deleteEventMutation] = useMutation(DELETE_EVENT_MUTATION)

  if (!timestamps) {
    return null
  }

  const getEventTime = (timestamp: string) => {
    return format(new Date(timestamp), 'dd.MM h:mm')
  }

  const getEventDate = (timestamp: string) => {
    return format(new Date(timestamp), 'YYY-MM-dd')
  }

  const deleteEvent = async (timestamp: number, day: string) => {
    await deleteEventMutation({
      variables: { timestamp, day },
      refetchQueries: [{query: TIMESTAMPS, variables: {days: getWeekDayslabels()}}]
  })
  }

  const handleEventSelection = (chartWrapper: any )=> {
    const chart = chartWrapper.getChart()
    const selection = chart.getSelection()
    if (selection.length === 1) {
      const [selectedItem] = selection
      const { row } = selectedItem
      if (!row ) return
      const value = chartWrapper.getDataTable().getValue(row, 2)
      const eventTime = getEventTime(value)
      const awsTimestamp = Math.floor(+new Date(value) / 1000)
      if(window.confirm(`Do you want to delete ${eventTime}?`)) {
        deleteEvent(awsTimestamp, getEventDate(value))
      }
      setTimeout(() => chart.setSelection([]), 1000)
    }
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
        chartEvents={[
          {
            eventName: 'select',
            callback: ({chartWrapper}) => {
              handleEventSelection(chartWrapper)
            }
          }
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
