import React from 'react'
import { useQuery, useMutation } from "@apollo/react-hooks"
import ErrorMessage from '../components/Error'
import { IGNORE_EVENTS_MUTATION, IGNORE_EVENTS_QUERY } from '../api'
import {Button, Container} from '@material-ui/core'

const IgnoreButton = () => {
    const { error, data } = useQuery(IGNORE_EVENTS_QUERY)
    const [ignoreEvents] = useMutation(IGNORE_EVENTS_MUTATION)

    async function toggleIgnoreEvent() {
        const newEventState = !data?.getIgnoreEvents
        await ignoreEvents({
            variables: { state: newEventState },
            refetchQueries: ["ignoreEvents"]
        })
    }

    if (error) return <ErrorMessage message="Failed to load areas" />
    const buttonText = data?.getIgnoreEvents ? 'Ignored' : 'Ignore Events'
    const buttonAttribute = data?.getIgnoreEvents ? 'default' : 'primary'

    return (
        <Container>
            <Button variant="contained" color={buttonAttribute} onClick={toggleIgnoreEvent}>
                {buttonText}
            </Button>
        </Container>
      )
  }

export default IgnoreButton
