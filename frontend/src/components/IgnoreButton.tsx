import React, { useEffect } from 'react'
import { useQuery, useMutation } from "@apollo/react-hooks"
import ErrorMessage from '../components/Error'
import { IGNORE_EVENTS_MUTATION, IGNORE_EVENTS_QUERY, IGNORE_EVENTS_SUBSCRIPTION } from '../api'
import { Button } from '@material-ui/core'
import styles from '../style/Button.module.scss'

const IgnoreButton = () => {
    const { subscribeToMore, error, data  } = useQuery(IGNORE_EVENTS_QUERY)
    const [ignoreEvents] = useMutation(IGNORE_EVENTS_MUTATION)

    useEffect(() => {
        const subscribe = () => {
          return subscribeToMore({
            document: IGNORE_EVENTS_SUBSCRIPTION,
            onError: error => {
              console.log(error)
              subscribe()
            },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev
              const { getIgnoreEvents } = subscriptionData?.data
              return {getIgnoreEvents}
            }
          })
        }
    
        const unsubscribe = subscribe()
        return () => {
          unsubscribe()
        }
      }, [])

    async function toggleIgnoreEvent() {
        const newEventState = !data?.getIgnoreEvents
        await ignoreEvents({
            variables: { state: newEventState }
        })
    }

    if (error) return <ErrorMessage message="Failed to load data" />
    const buttonText = data?.getIgnoreEvents ? 'Ignored' : 'Ignore Events'
    const buttonAttribute = data?.getIgnoreEvents ? 'default' : 'primary'

    return (
        <div className={styles.wrapper}>
            <Button classes={{ root: styles.buttonStyleOverwrite}} variant="contained" color={buttonAttribute} onClick={toggleIgnoreEvent}>
                {buttonText}
            </Button>
        </div>
      )
  }

export default IgnoreButton
