import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import WcIcon from '@material-ui/icons/Wc'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import React, { useState } from 'react'
import { Auth } from 'aws-amplify'
import { useHistory } from "react-router-dom"

const Login = () => {
    const [state, setState] = useState({username: '', password: ''})
    const history = useHistory()
    
    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        },
    }))
    const classes = useStyles()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const cognitoUser = await Auth.signIn(username, password)
            if (cognitoUser.challengeParam) {
                const userAttributes = cognitoUser.challengeParam.userAttributes
                delete userAttributes.email_verified

                cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
                    onSuccess: (result: any) => {
                        history.push("/")
                    },
                    onFailure: (err: any) => {
                        console.error(err)
                    }
                })
            } else {
                history.push("/")
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleChange = (e:any) => {
        e.preventDefault()
        const key = e.target.id
        const value = e.target.value
        setState({ ...state, [key]: value })
    }

    const { password, username } = state

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <WcIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
        </Typography>
                <form className={classes.form} 
                      noValidate
                      onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                        id="username"
                        value={username}
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        onChange={handleChange}
                        value={password}
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
          </Button>
                </form>
            </div>
        </Container>
    )
}

export default Login