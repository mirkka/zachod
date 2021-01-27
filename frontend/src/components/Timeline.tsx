import React, { useState } from 'react'
import { useMutation } from "@apollo/react-hooks"
import { Typography } from '@material-ui/core'
import { format, startOfDay, differenceInMinutes } from 'date-fns'
import { DELETE_EVENT_MUTATION } from '../api'
import { times, reduce } from 'lodash-es'
import styles from '../style/Timeline.module.scss'

type TimelineProps = {
    timestamps: number[]
    label: string
}

const Timeline = (props: TimelineProps) => {
  const { timestamps, label } = props
  const [deleteEventMutation] = useMutation(DELETE_EVENT_MUTATION)
  const [state, setState] = useState({ labelsVisible: false })

  if (!timestamps) {
    return null
  }

  const getEventTime = (timestamp: number) => {
    return format(new Date(timestamp), 'dd.MM HH:mm')
  }

  const getEventDate = (timestamp: number) => {
    return format(new Date(timestamp), 'YYY-MM-dd')
  }

  const deleteEvent = async (timestamp: number, day: string) => {
    await deleteEventMutation({
      variables: { timestamp, day }
    })
  }

  const handleDeleteEvent = (timestamp: number, e: any) => {
    e.preventDefault()
    const value = timestamp
    const eventTime = getEventTime(value * 1000)
    const awsTimestamp = Math.floor(+new Date(value))
    if (window.confirm(`Do you want to delete ${eventTime}?`)) {
      deleteEvent(awsTimestamp, getEventDate(value * 1000))
    }
  }

  const findOverlappingEvents = (timestamps: number[]) => {
    return reduce(timestamps, (acc: any, value) => {
      const overlapping = !!acc.find((item: any) => format(item.timestamp * 1000, 'HH') === format(value * 1000, 'HH'))
      acc.push({ timestamp: value, overlapping})
      return acc
    }, [])}

  const hasOverlappingEvent = () => {
    const hasOverlappingEvents = !!findOverlappingEvents(timestamps).find((event: any) => event.overlapping)
    return hasOverlappingEvents && state.labelsVisible
  }

  const toggleEventLabels = (e: any) => {
    e.preventDefault()
    setState({ ...state, labelsVisible: !state.labelsVisible })
  }

  const date = new Date(label)
  const formatDateLabel = format(date, 'dd.MM')

  const event = ({timestamp, overlapping}: any) => {
    const start = startOfDay(timestamp * 1000)
    const eventInMinutes = differenceInMinutes(timestamp * 1000, start)
    const eventPosition = 100 - ((1440 - eventInMinutes) / 14.4)
    const time = format(timestamp * 1000, 'H:mm')
    return (
      <div className={styles.event} style={{ left: `${eventPosition}%`}} key={timestamp}>
        <div className={styles.dot}/>
        {state.labelsVisible && (<div className={`${styles.tag} ${overlapping && styles.tagTop}`} onClick={handleDeleteEvent.bind(null, timestamp)}>
          <div className={`${styles.triangle} ${overlapping && styles.triangleTop}`}></div>
          <div className={`${styles.timestamp} ${overlapping && styles.timestampTop}`}>{time}</div>
        </div>)}
      </div>
    )
  }

  const tick = (index: number) => {
    const position = index * (100 / 24)
    return (
      <div className={styles.tick} style={{ left: `${position}%` }} key={index}>
        <div className={styles.tickNumber}>{index}</div>
      </div>
    )
  }

  const timeline = (
    <div className={`${styles.wrapper} ${state.labelsVisible && styles.wrapperExpanded}`}>
      <Typography variant="h6" component="h6" onClick={toggleEventLabels}>
        {formatDateLabel}
      </Typography>
      <div className={`${styles.container} ${hasOverlappingEvent() && styles.containerOverlapping}`}>
        <div className={styles.line}>
          {times(25).map((i) => tick(i))}
          {findOverlappingEvents(timestamps).map((timestamp: any) => event(timestamp))}
        </div>
      </div>
    </div>
  )

  return timeline
}

export default Timeline
