import * as React from 'react'
import Main from './components/Main'
import Login from './components/Login'
import { GuardedRoute } from 'react-router-guards'
import { Auth } from 'aws-amplify'

const authGuard = async (to: any, from: any, next: any) => {
    try {
        await Auth.currentSession()
        next()
    } catch (error) {
        console.log(error)
        next.redirect('/login')
    }
}

const loginAuthGuard = async (to: any, from: any, next: any) => {
    try {
        await Auth.currentSession()
        next.redirect('/')
    } catch (error) {
        next()
    }
}

export default [
    <GuardedRoute
        path={`/login`}
        component={Login}
        guards={[loginAuthGuard]}
        exact
        key='login'
    />,
    <GuardedRoute
        path="/"
        exact
        guards={[authGuard]}
        component={Main}
        key=''
    />
]