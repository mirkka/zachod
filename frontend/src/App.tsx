import React from 'react'
// import Chart from './components/Chart'
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import { TIMESTAMPS, IGNORE_EVENTS_MUTATION, IGNORE_EVENTS_QUERY, TIMESTAMPS_SUBSCRIPTION } from './api'
import ErrorMessage from './components/Error'
import styles from './style/Button.module.scss'



const App = () => {
  const today =  new Date().toISOString().substr(0,10)
  const { subscribeToMore, loading, error, data } = useQuery(TIMESTAMPS, {
    variables: {day: today}
  })
  const { data: ineData } = useSubscription(
    TIMESTAMPS_SUBSCRIPTION
  );

  const { error: ignoreError, data: ignoreEventData } = useQuery(IGNORE_EVENTS_QUERY)
  const [ignoreEvents] = useMutation(IGNORE_EVENTS_MUTATION)

  async function toggleIgnoreEvent() {
    const newEventState = !ignoreEventData?.getIgnoreEvents
    await ignoreEvents({
      variables: { state: newEventState },
      refetchQueries: ["ignoreEvents"]
    })
  }

  const subscribeToNewComments = () => {
    return subscribeToMore({
      document: TIMESTAMPS_SUBSCRIPTION,
      variables: { day: today },
      onError: () => console.log('err'),
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData)
        if (!subscriptionData.data) return prev
        const newTimestamp = subscriptionData.data.getTimestamps
        return {getTimestamps: [newTimestamp, ...prev.getTimestamps]}
      }
    })
  }

  if (loading) return null
  if (error || !data || ignoreError) return <ErrorMessage message="Failed to load areas" />
  
  subscribeToNewComments()

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <button onClick={toggleIgnoreEvent} className={styles.button}>
          {`Ignored: ${ignoreEventData?.getIgnoreEvents}`}
        </button>
        <div>{data.getTimestamps.join(', ')}</div>
      </div>
    </div>
  )
}

export default App
