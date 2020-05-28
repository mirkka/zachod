import React, { useState, useEffect } from 'react'
import styles from '../style/Countdown.module.scss'
import classNames from 'classnames/bind'
import { Typography } from '@material-ui/core'
import CatIcon from '../icons/cat.svg'

const cx = classNames.bind(styles)

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
  const counter = (
    <div className={styles.red}>
    <Typography variant="caption" component="div">
      Minutes left
    </Typography>
    <Typography variant="h3" component="h3">
      {minutesLeft}
    </Typography>
    </div>
  )

  const ok = (
    <Typography variant="h4" component="h3" className={styles.green}>
      <img src={CatIcon} alt="cat" className={styles.catIcon}/>
    </Typography>
  )

  return (
    <div className={styles.wrapper}>
      {/* <div>start: { new Date(timestamp * 1000).toISOString() }</div> */}
      {/* <div>now: { now }</div> */}
      <div>{ minutesLeft <= 0 ? ok : counter }</div>
      {/* <div>end: { new Date(end).toISOString() }</div> */}
    </div>
  )
}

export default Countdown
