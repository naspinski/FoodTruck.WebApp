import { Component, useState, useEffect } from 'react';
import * as React from 'react';
import { Location } from '../models/Location';
import Address from './../components/Address';
import Map from './../components/Map';
import FormAlerts from './../components/FormAlerts';
import './Contact.scss';
import { MDBRow, MDBCol, MDBBtnGroup, MDBBtn } from 'mdbreact';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SiteContext from '../models/SiteContext';

interface IState {
    location: Location,
    googleMapsApiKey: string,
    type:string,
    contactEmail: string,
    message: string,
    attachment: File | null,
    date: Date | null,
    sendingState: 'waiting' | 'sending' | 'sent' | 'error' | 'input-error'
}

const Contact = () => {

    const context = React.useContext(SiteContext);

    const [location, setLocation] = useState(new Location());
    const [googleMapsApiKey, setGoogleMapsApiKey] = useState(context.settings.googleMapsApiKey);
    const [type, setType] = useState<'Contact' | 'Apply' | 'Book'>('Contact')
    const [contactEmail, setContactEmail] = useState('');
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [date, setDate] = useState(null);
    const [sendingState, setSendingState] = useState<'waiting' | 'sending' | 'sent' | 'error' | 'input-error'>('waiting');
    
    useEffect(() => {
        fetch('api/location')
            .then((resp) => resp.json())
            .then((data) => setLocation(new Location(data)));
    }, []);

    const handleAttachmentChange = (event: any) => {
        if (event.target.files) {
            setAttachment(event.target.files[0]);
        }
    }

    const formId = 'contact-form';

    const handleSubmit = (event: any) => {
        event.preventDefault();
        event.target.className += ' was-validated';
        let isValid = (document.getElementById(formId) as HTMLFormElement).checkValidity();
        if (isValid) {
           setSendingState('sending');

            const payload = {
                Email: contactEmail,
                Message: message,
                Type: type
            }

            let options: any = {
                method: 'post'
            };

            
            let formData = new FormData();
            formData.append('Email', payload.Email);
            formData.append('Message', payload.Message);
            formData.append('Type', payload.Type);
            if (type === 'Book') {
                formData.append('DateTime', date);
            }
            if (type === 'Apply' && attachment !== null) {
                formData.append('Attachment', attachment);
            }
            options.body = formData;

            fetch('api/contact', options)
                .then(response => {
                    setSendingState(response.status === 200 ? 'sent' : 'error');
                })
                .catch(error => {
                    console.error('error', error);
                    setSendingState('error')
                });
        } else {
            setSendingState('input-error')
        }
    }

    const settings = context.settings;

    const address = location && location.address && location.address.length > 0
        ? <div>
            <h3 className='b'>
                <FontAwesomeIcon icon='map-marker-alt' /> Location
            </h3>
            <Map location={location} id='contact-map' zoom={11} />
            <div className='b'>
                <Address location={location} />
            </div>
        </div>
        : '';

    const dateTimePicker = type !== 'Book' ? '' :
        <div className='pt2 b'>
            <label htmlFor='date'>Date/Time</label>
            <DatePicker id='date'
                showTimeSelect
                dateFormat='MM/dd/yyyy HH:mm'
                popperPlacement='top'
                className='form-control'
                selected={date}
                onChange={setDate}
            />
        </div>;

    const phone = settings.contactPhone.length === 0 ? '' :
        <React.Fragment>
            <h3 className='b'>
                <FontAwesomeIcon icon='phone' /> Phone
            </h3>
            <address className='f4 pt2 left pl2'>
                <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
            </address>
        </React.Fragment>;

    const disableSend = sendingState === 'sending';

    return (
        <div id='contact' className='primary-color pb2'>
            <div className='inner-container'>
                <h2 className='border-dotted bottom'>Contact</h2>
                <MDBRow>
                    <MDBCol md='6'>
                        <div className='ph2'>
                            <h3 className='b'>
                                <FontAwesomeIcon icon='envelope' /> Get in touch
                            </h3>
                            {settings.isBrickAndMortar && !settings.isApplyOn ? '' :
                                <MDBBtnGroup>
                                    <MDBBtn active={type === 'Contact'} onClick={() => setType('Contact')}>Info</MDBBtn>
                                    {settings.isBrickAndMortar ? '' : <MDBBtn active={type === 'Book'} onClick={() => setType('Book')}>Book</MDBBtn>}
                                    {settings.isApplyOn ? <MDBBtn active={type === 'Apply'} onClick={() => setType('Apply')}>Apply</MDBBtn> : ''}
                                </MDBBtnGroup>
                            }
                            <form id={formId} onSubmit={handleSubmit} className='ph1 needs-validation' noValidate>
                                <div className='pt2 b'>
                                    <label htmlFor='contactEmail'>Email Address</label>
                                    <input type='email' id='contactEmail' className='form-control validate' onChange={e => setContactEmail(e.target.value)} required />
                                </div>
                                {dateTimePicker}
                                <div className='pt2 b'>
                                    <label htmlFor='message'>Message</label>
                                    <textarea id='message' className='form-control' onChange={e => setMessage(e.target.value)} required />
                                </div>
                                {type !== 'Apply' ? '' :
                                    <div className='input-group pt3 b'>
                                        <div className='input-group-prepend'>
                                            <span className='input-group-text' id='AttachmentPre'>Upload</span>
                                        </div>
                                        <div className='custom-file'>
                                            <input type='file'
                                                className='custom-file-input'
                                                id='Attachment' name='Attachment'
                                                aria-describedby='AttachmentPre'
                                                onChange={handleAttachmentChange} />
                                            <label className='custom-file-label' htmlFor='Attachment'>Attachment</label>
                                        </div>
                                    </div>
                                }
                                <div className='pt2 flex justify-between'>
                                    <div className='pt1'>
                                        <FormAlerts sendingState={sendingState} sentMessage='Message sent, we will be in touch shortly!' />
                                    </div>
                                    <div>
                                        <MDBBtn color='pink' type='submit' disabled={disableSend} >
                                            <FontAwesomeIcon icon='chevron-circle-right' /> Send
                                        </MDBBtn>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </MDBCol>
                    <MDBCol md='6'>
                        <div className='ph2'>
                            {address}
                            {phone}
                        </div>
                    </MDBCol>
                </MDBRow>
            </div>
        </div>
    );
}
export default Contact;