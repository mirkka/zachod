import React, { useEffect } from 'react'
import { useQuery } from "@apollo/react-hooks"
import styles from './style/App.module.scss'
import { TIMESTAMPS, TIMESTAMPS_SUBSCRIPTION } from './api'
import ErrorMessage from './components/Error'
import { getWeekDayslabels } from './helpers'
import Timeline from './components/Timeline'
import Countdown from './components/Countdown'
import BarChart from './components/BarChart'
import IgnoreButton from './components/IgnoreButton'
import { Typography } from '@material-ui/core'

const App = () => {
  const weekDayslabels: string[] = getWeekDayslabels()
  const { subscribeToMore, loading, error, data } = useQuery(TIMESTAMPS, {
    variables: {days: weekDayslabels}
  })

  useEffect(() => {
    const subscribe = () => {
      return subscribeToMore({
        document: TIMESTAMPS_SUBSCRIPTION,
        onError: error => {
          console.log(error)
          subscribe()
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newTimestamp = subscriptionData.data.getTimestamps
          const udpatedTodayTimestamps = [ ...prev.getTimestamps[0], newTimestamp ]
          const updatedAll = [ ...prev.getTimestamps ]
          updatedAll[0] = udpatedTodayTimestamps

          return { getTimestamps: updatedAll }
        }
      })
    }

    const unsubscribe = subscribe()
    window.addEventListener('offline', unsubscribe)
    window.addEventListener('online', () => {
      window.location.href = window.location.href
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (loading) return null
  if (error || !data) return <ErrorMessage message="Failed to load areas" />
  const todayData = data.getTimestamps[0]
  const yesterdayData = data.getTimestamps[1]
  const lastTimestampOfToday = todayData[todayData.length - 1]

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <IgnoreButton />
        {lastTimestampOfToday && <Countdown timestamp={lastTimestampOfToday} />}
        <Typography variant="h4" component="h4" gutterBottom>
          Daily Traffic
        </Typography>
        <Timeline label={weekDayslabels[1]} timestamps={yesterdayData}/>
        <Timeline label={weekDayslabels[0]} timestamps={todayData}/>
        <BarChart timestamps={data.getTimestamps} />
      </div>
    </div>
  )
}

export default App
