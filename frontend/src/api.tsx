import gql from 'graphql-tag'

export const TIMESTAMPS = gql`
    query getTimestamps($days: [String]) {
      getTimestamps(days: $days)
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

export const TIMESTAMPS_SUBSCRIPTION = gql`
  subscription getTimestamps {
    getTimestamps
  }
`;
