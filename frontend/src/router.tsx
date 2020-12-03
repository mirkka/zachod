import * as React from 'react'
import { Switch, BrowserRouter as Router } from 'react-router-dom'
import { GuardProvider } from 'react-router-guards'
import Routes from './routes'

const loading = () => (<div>loading</div>)
const error = () => (<div>error</div>)

export default () => {
    return (
        <Router>
            <div>
                <GuardProvider loading={loading} error={error}>
                    <Switch>
                        {Routes}
                    </Switch>
                </GuardProvider>
            </div>
        </Router>
    )
}
