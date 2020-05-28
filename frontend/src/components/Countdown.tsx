import React, { useState, useEffect } from 'react'

type CountdownProps = {
    timestamp: number
}

const HOUR = 1000 * 60 * 60

const Countdown = (props: CountdownProps) => {
  const { timestamp } = props
  const end = (timestamp * 1000) + HOUR
  
  const [ now, setNow ] = useState(Math.floor(Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
        setNow(Math.floor(Date.now()))
    }, 1000)

    return () => {
        clearInterval(interval)
    }
  }, [])

  const minutesLeft = Math.floor((end - now) / 1000 / 60)

  return (
    <div style={{'float': 'right'}}>
        {/* <div>start: { new Date(timestamp * 1000).toISOString() }</div> */}
        {/* <div>now: { now }</div> */}
        <div>minutes left: { minutesLeft }</div>
        <div>{ minutesLeft <= 0 ? 'OK' : 'NOT OK' }</div>
        {/* <div>end: { new Date(end).toISOString() }</div> */}
    </div>
  )
}

export default Countdown
