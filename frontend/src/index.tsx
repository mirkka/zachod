import React from 'react'
import ReactDOM from 'react-dom'
import './style/global.scss'
import App from './App'
import { Auth } from 'aws-amplify'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloLink } from 'apollo-link'
import { createAuthLink } from 'aws-appsync-auth-link'
import { createHttpLink } from 'apollo-link-http'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from "apollo-cache-inmemory"
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'

const url = 'https://ddj7g6pphvfn5lyyiukvfidgp4.appsync-api.eu-west-1.amazonaws.com/graphql'
const region = 'eu-west-1'
const auth = {
  type: "AMAZON_COGNITO_USER_POOLS",
  jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken()
} as any

const httpLink = createHttpLink({
  uri: url,
});

 const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink(url, httpLink)
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const WithProvider = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(<WithProvider />, document.getElementById('root'))

export default WithProvider
