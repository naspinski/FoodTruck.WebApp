import * as React from 'react';
import Alert from './Alert';

interface IProps {
    sendingState: 'waiting' | 'sending' | 'sent' | 'error' | 'input-error'
    sendingMessage?: string,
    sentMessage?: string,
    errorMessage?: string,
    inputErrorMessage?: string
}

const FormAlerts = ({ sendingState, sendingMessage, sentMessage, errorMessage, inputErrorMessage }: IProps) => {

    sendingMessage = sendingMessage ?? 'Sending...';
    sentMessage = sentMessage ?? 'Sent';
    errorMessage = errorMessage ?? 'Error sending message';
    inputErrorMessage = inputErrorMessage ?? 'Input error'

    return <React.Fragment>
        <Alert hide={sendingState !== 'sending'} message={sendingMessage} type='info' />
        <Alert hide={sendingState !== 'sent'} message={sentMessage} type='success' />
        <Alert hide={sendingState !== 'error'} message={errorMessage} type='error' />
        <Alert hide={sendingState !== 'input-error'} message={inputErrorMessage} type='error' />
    </React.Fragment>
}
export default FormAlerts;