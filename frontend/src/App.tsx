import React from 'react'
// import Chart from './components/Chart'
import { useQuery, useMutation } from "@apollo/react-hooks";
import { TIMESTAMPS, IGNORE_EVENTS_MUTATION, IGNORE_EVENTS_QUERY } from './api'
import ErrorMessage from './components/Error'
import styles from './style/Button.module.scss'



const App = () => {
  const today =  new Date().toISOString().substr(0,10)
  const { loading, error, data } = useQuery(TIMESTAMPS, {
    variables: {day: today}
  })
  const { error: ignoreError, data: ignoreEventData } = useQuery(IGNORE_EVENTS_QUERY)
  const [ignoreEvents] = useMutation(IGNORE_EVENTS_MUTATION)

  async function toggleIgnoreEvent() {
    const newEventState = !ignoreEventData?.getIgnoreEvents
    await ignoreEvents({
      variables: { state: newEventState },
      refetchQueries: ["ignoreEvents"]
    })
  }

  if (loading) return null
  if (error || !data || ignoreError) return <ErrorMessage message="Failed to load areas" />


  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <button onClick={toggleIgnoreEvent} className={styles.button}>
          {`Ignored: ${ignoreEventData?.getIgnoreEvents}`}
        </button>
      </div>
    </div>
  )
}

export default App
