import * as React from 'react';
import { MDBAlert } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
    type: 'info' | 'error' | 'success',
    message: string,
    hide?: boolean
}

const Alert = ({ type, message, hide }: IProps) => {

    const color = type === 'error' ? 'danger' : type;
    const icon = type === 'info' ? 'info-circle' : (type === 'error' ? 'exclamation-circle' : 'thumbs-up');

    return (hide ? <React.Fragment></React.Fragment> :
        <MDBAlert color={color} className='tl'>
            <FontAwesomeIcon icon={icon} /> {message}
        </MDBAlert>);
}
export default Alert;