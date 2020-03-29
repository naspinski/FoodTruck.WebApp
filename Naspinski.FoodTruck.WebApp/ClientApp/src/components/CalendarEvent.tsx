import { Component } from 'react';
import * as React from 'react';
import { Event } from '../models/Event';
import { Location } from '../models/Location';
import Address from './Address';
import { Map } from './Map';
import { MDBBtn, MDBRow, MDBCol, MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormAlerts from './../components/FormAlerts';

interface IProps {
    event: Event,
    id: number,
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
}

interface IState {
    isMapHidden: boolean,
    modal: boolean,
    sendTo: string,
    isValidEmailOrPhone: boolean,
    sendingState: 'waiting' | 'sending' | 'sent' | 'error' | 'input-error'
}

export class CalendarEvent extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isMapHidden: true,
            modal: false,
            sendTo: '',
            isValidEmailOrPhone: true,
            sendingState: 'waiting'
        };
    }

    formId: string = `subscribe-${this.props.id}`;
    sendToId: string = `${this.formId}-send-to`;
    handleSendToChange = (event: any) => { this.setState({ sendTo: event.target.value }); }
    toggleModal = () => { this.setState({ modal: !this.state.modal }); }

    mapVisibilityChange = () => {
        this.setState({ isMapHidden: !this.state.isMapHidden });
    }

    testInput = () => {

    }

    submitHandler = event => {
        event.preventDefault();
        event.target.className += ' was-validated';
        let isValid = (document.getElementById(this.formId) as HTMLFormElement).checkValidity();
        const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.sendTo);
        const validPhone = /^\d{10}$/.test(this.state.sendTo.replace('(', '').replace(')', '').replace(' ', '').replace('-', ''));
        isValid = validEmail || validPhone;
        (document.getElementById(this.sendToId) as HTMLFormElement).setCustomValidity(isValid ? '' : 'invalid email/phone');

        if (isValid) {
            this.setState({ sendingState: 'sending' });
            fetch('api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Location: this.props.event.location.name,
                    Subscriber: this.state.sendTo
                })
            })
                .then(response => {
                    this.setState({ sendingState: response.status === 200 ? 'sent' : 'error' });
                })
                .catch(error => {
                    console.error('error', error);
                    this.setState({ sendingState: 'error' })
                });
        } else {
            this.setState({ sendingState: 'input-error' });
        }
    };

    render() {
        const event = new Event(this.props.event);
        const errorMessage = 'You must supply a valid email or phone number'

        const time = event.beginsTime && event.beginsTime.length > 0 ?
            <div className='f5'>
                {event.beginsTime}{event.endsTime && event.endsTime.length > 0 ? ' - ' + event.endsTime : ''}
            </div> : '';

        const location = new Location(event.location);
        const mapButton = !location.isValidForMap  ? '' :
            <MDBBtn size='sm' onClick={this.mapVisibilityChange}>
                <FontAwesomeIcon icon='map-marker-alt' /> {this.state.isMapHidden ? 'map' : 'hide'}
            </MDBBtn>


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
                        <h4 className='b serif mv0 pt2'>{event.location.name}</h4>
                        <Address location={event.location} />
                        <div className='pl0'>
                            <MDBBtn size='sm' onClick={this.toggleModal}>
                                <FontAwesomeIcon icon='star' /> Subscribe
                            </MDBBtn>
                            {mapButton}
                        </div>
                    </MDBCol>
                    <MDBCol md='5' className='pb1'>
                        <Map location={event.location}
                            id={`calendar-map-${this.props.id}`}
                            googleMapsApiKey={this.props.googleMapsApiKey}
                            isGoogleMapsLoaded={this.props.isGoogleMapsLoaded}
                            zoom={11}
                            isHidden={this.state.isMapHidden}
                        />
                    </MDBCol>
                </MDBRow>
                <MDBModal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <form id={this.formId} className='needs-validation' onSubmit={this.submitHandler} noValidate>
                        <MDBModalHeader className='b' toggle={this.toggleModal}>Subscribe to {event.location.name}</MDBModalHeader>
                        <MDBModalBody>
                            <div className='pt2 b'>
                                <label htmlFor={this.sendToId}>Email Address or Phone Number</label>
                                <input required min='5' id={this.sendToId} type='text' className='form-control' onChange={this.handleSendToChange} />
                                <div className="invalid-feedback">{errorMessage}</div>
                            </div>
                        </MDBModalBody>
                        <MDBModalFooter className='flex justify-between'>
                            <div className='pt2'>
                                <FormAlerts sendingState={this.state.sendingState} sentMessage='Subscribed!' />
                            </div>
                            <MDBBtn color='pink' type='submit'>
                                <FontAwesomeIcon icon='chevron-circle-right' /> Subscribe
                            </MDBBtn>
                        </MDBModalFooter>
                    </form>
                </MDBModal>
            </MDBContainer>
        );
    }
}