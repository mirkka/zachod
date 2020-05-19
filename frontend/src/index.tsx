import React from 'react'
import ReactDOM from 'react-dom'
import './style/global.scss'
import App from './App'
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloLink } from 'apollo-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createHttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";

const url = 'https://u67wqc2vyvdunnhupmlpz3razq.appsync-api.eu-west-1.amazonaws.com/graphql'
const region = 'eu-west-1'
const auth = {
  type: 'AWS_IAM',
  credentials: {
    accessKeyId: 'AKIAXGR66O2MRON33AM4',
    secretAccessKey: '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',
  }
} as any

const link = ApolloLink.from([
   createAuthLink({ url, region, auth }),
   createHttpLink({ uri: url })
]);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const WithProvider = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(<WithProvider />, document.getElementById('root'))

export default WithProvider


