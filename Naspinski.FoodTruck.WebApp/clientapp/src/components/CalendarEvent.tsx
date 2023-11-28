import { useState } from 'react';
import * as React from 'react';
import { EventModel } from '../models/Event';
import { Location } from '../models/Location';
import Address from './Address';
import Map from './Map';
import { MDBBtn, MDBRow, MDBCol, MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormAlerts, { FormAlertStates } from './../components/FormAlerts';
import { RegularExpressions } from '../Utility';
import { NavLink } from 'react-router-dom';

interface IProps {
    event: EventModel,
    id: number
}

const CalendarEvent = ({ event, id }: IProps) => {

    const [isMapHidden, setIsMapHidden] = useState(true);
    const [modal, setModal] = useState(false);
    const [sendTo, setSendTo] = useState('');
    const [sendingState, setSendingState] = useState<FormAlertStates>('waiting');
    
    const formId: string = `subscribe-${id}`;
    const sendToId: string = `${formId}-send-to`;
    const handleSendToChange = (event: any) => { setSendTo(event.target.value); }
    const toggleModal = () => { setModal(!modal); }

    const mapVisibilityChange = () => {
        setIsMapHidden(!isMapHidden);
    }

    const submitHandler = event => {
        event.preventDefault();
        event.target.className += ' was-validated';
        let isValid = (document.getElementById(formId) as HTMLFormElement).checkValidity();
        const validEmail = RegularExpressions.email.test(sendTo);
        const validPhone = RegularExpressions.phone.test(sendTo.replace('(', '').replace(')', '').replace(' ', '').replace('-', ''));
        isValid = isValid && (validEmail || validPhone);
        (document.getElementById(sendToId) as HTMLFormElement).setCustomValidity(isValid ? '' : 'invalid email/phone');

        if (isValid) {
            setSendingState('sending' );
            fetch('api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Location: event.location.name,
                    Subscriber: sendTo
                })
            })
                .then(response => {
                    setSendingState(response.status === 200 ? 'sent' : 'error');
                })
                .catch(error => {
                    console.error('error', error);
                    setSendingState('error');
                });
        } else {
            setSendingState('input-error');
        }
    };

    event = new EventModel(event);

    const errorMessage = 'You must supply a valid email or phone number'

    const time = event.beginsTime && event.beginsTime.length > 0 ?
        <div className='f5'>
            {event.beginsTime}{event.endsTime && event.endsTime.length > 0 ? ' - ' + event.endsTime : ''}
        </div> : '';

    const location = new Location(event.location);
    const mapButton = !location.isValidForMap  ? '' :
        <MDBBtn size='sm' onClick={mapVisibilityChange}>
            <FontAwesomeIcon icon='map-marker-alt' /> {isMapHidden ? 'map' : 'hide'}
        </MDBBtn>

    console.log('modal', modal)

    return (
        <MDBContainer tag='div' className='border-dotted bottom pa3'>
            <MDBRow>
                <MDBCol md='3'>
                    <div className='left-frame'>
                        <h4 className='b'>{event.beginsMonth} {event.beginsDay}</h4>
                        {time}
                    </div>
                </MDBCol>
                <MDBCol md='4'>
                    <h4 className='b serif mv0 pt2 ttc'>{event.location.name}</h4>
                    <Address location={event.location} />
                    <div className='pl0'>
                        <MDBBtn size='sm' onClick={toggleModal}>
                            <FontAwesomeIcon icon='star' /> Subscribe
                            </MDBBtn>
                        {mapButton}
                    </div>
                </MDBCol>
                <MDBCol md='5' className='pb1'>
                    <Map location={event.location}
                        id={`calendar-map-${id}`}
                        zoom={11}
                        isHidden={isMapHidden}
                    />
                </MDBCol>
            </MDBRow>
            <MDBModal isOpen={modal} setopen={setModal}>
                <form id={formId} className='needs-validation' onSubmit={submitHandler} noValidate>
                    <MDBModalHeader className='b' toggle={toggleModal}>Subscribe to {event.location.name}</MDBModalHeader>
                    <MDBModalBody>
                        <div className='pt2 b'>
                            <label htmlFor={sendToId}>Email Address or Phone Number</label>
                            <input required min='5' id={sendToId} type='text' className='form-control' onChange={handleSendToChange} />
                            <div className="invalid-feedback">{errorMessage}</div>
                        </div>
                        <div className="pt1 terms-container">
                            subscribing implies consent to our <NavLink to='/terms'>terms</NavLink>
                        </div>
                    </MDBModalBody>
                    <MDBModalFooter className='flex justify-between'>
                        <div className='pt2'>
                            <FormAlerts sendingState={sendingState} sentMessage='Subscribed!' />
                        </div>
                        <MDBBtn color='pink' type='submit'>
                            <FontAwesomeIcon icon='chevron-circle-right' /> Subscribe
                        </MDBBtn>
                    </MDBModalFooter>
                </form>
            </MDBModal>
    </MDBContainer>);
}
export default CalendarEvent;