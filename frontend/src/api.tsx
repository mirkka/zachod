import gql from 'graphql-tag'

export const TIMESTAMPS = gql`
    query getTimestamps($day: String) {
      getTimestamps(day: $day)
    }
`

export const IGNORE_EVENTS_MUTATION = gql`
  mutation ignoreEvents($state: Boolean) {
    ignoreEvents(state: $state)
  }
`

export const IGNORE_EVENTS_QUERY = gql`
    query ignoreEvents {
      getIgnoreEvents
    }
`
