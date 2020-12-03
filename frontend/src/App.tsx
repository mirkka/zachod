import React from 'react'
import Router from './router'
import Amplify, { Auth } from 'aws-amplify'

const authOptions = {
  region: 'eu-west-1',
  userPoolId: 'eu-west-1_EecbavrqH',
  userPoolWebClientId: '3b1iu1eri1n8j2tr9qs3luq50q'
}
Auth.configure(authOptions)
Amplify.configure({
  Auth,
  disableOffline: true,
  fetchPolicy: 'no-cache'
})

const App = () => {
  return (
    <div>
      <Router />
    </div>
  )
}

export default App
