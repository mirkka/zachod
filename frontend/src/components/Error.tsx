import React from 'react'
import styles from '../style/Error.module.scss'

type ErrorMessageProps = {
  message: string
}

const ErrorMessage = ({message}: ErrorMessageProps) => {
  return <div className={styles.message}>{message}</div>
}

export default ErrorMessage
